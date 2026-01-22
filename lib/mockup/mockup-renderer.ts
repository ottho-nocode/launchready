import sharp from 'sharp';
import path from 'path';
import type { DeviceColor, DeviceType, MockupTemplate } from '@/types/app';
import { getDeviceColors, getDeviceFrame } from './device-frames';
import { getTemplateConfig, hasImageTemplate } from './template-config';

export interface MockupOptions {
  deviceType: DeviceType;
  deviceColor: DeviceColor;
  template: MockupTemplate;
  backgroundColor: string;
  headline?: string;
  fontFamily?: string;
}

export interface MockupResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: 'png';
}

/**
 * Generates a mockup from a screenshot using Sharp
 */
export async function generateMockup(
  screenshotBuffer: Buffer,
  options: MockupOptions
): Promise<MockupResult | null> {
  const frame = getDeviceFrame(options.deviceType);
  if (!frame) {
    return null;
  }

  // Process screenshot with Sharp (resize to exact screen dimensions)
  const processedScreenshot = await sharp(screenshotBuffer)
    .resize(frame.screenWidth, frame.screenHeight, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toBuffer();

  // Generate based on template
  let result: Buffer;

  switch (options.template) {
    case 'app-store':
      result = await renderAppStoreTemplate(processedScreenshot, options);
      break;
    case 'frame':
      result = await renderFrameTemplate(processedScreenshot, options);
      break;
    case 'gradient':
      result = await renderGradientTemplate(processedScreenshot, options);
      break;
    case 'text-overlay':
      result = await renderTextOverlayTemplate(processedScreenshot, options);
      break;
    default:
      result = await renderAppStoreTemplate(processedScreenshot, options);
  }

  return {
    buffer: result,
    width: frame.frameWidth,
    height: frame.frameHeight,
    format: 'png',
  };
}

/**
 * Template: Frame - Device frame with screenshot inside
 * Uses image template if available, otherwise generates programmatically
 */
async function renderFrameTemplate(
  screenshotBuffer: Buffer,
  options: MockupOptions
): Promise<Buffer> {
  // Check if we have an image template for this device
  if (hasImageTemplate(options.deviceType)) {
    return renderImageTemplate(screenshotBuffer, options);
  }

  // Fallback to programmatic generation
  const frame = getDeviceFrame(options.deviceType)!;
  const colors = getDeviceColors(options.deviceColor);

  // Create device frame SVG
  const frameSvg = createFrameSvg(frame, colors);

  // Create the frame as PNG
  const frameImage = await sharp(Buffer.from(frameSvg))
    .resize(frame.frameWidth, frame.frameHeight)
    .png()
    .toBuffer();

  // Create rounded screenshot with mask
  const roundedScreenshot = await createRoundedImage(
    screenshotBuffer,
    frame.screenWidth,
    frame.screenHeight,
    frame.cornerRadius - frame.bezelWidth
  );

  // Composite: background + frame + screenshot
  const backgroundColor = parseColor(options.backgroundColor);

  return sharp({
    create: {
      width: frame.frameWidth,
      height: frame.frameHeight,
      channels: 4,
      background: backgroundColor,
    },
  })
    .composite([
      {
        input: frameImage,
        top: 0,
        left: 0,
      },
      {
        input: roundedScreenshot,
        top: frame.screenOffsetY,
        left: frame.screenOffsetX,
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Template: Image-based - Uses a pre-made template image
 */
async function renderImageTemplate(
  screenshotBuffer: Buffer,
  options: MockupOptions
): Promise<Buffer> {
  const config = getTemplateConfig(options.deviceType)!;

  // Load the template image
  const templatePath = path.join(process.cwd(), 'public', config.imagePath);
  const templateBuffer = await sharp(templatePath).png().toBuffer();

  // Resize screenshot to fit the screen area
  const resizedScreenshot = await sharp(screenshotBuffer)
    .resize(config.screen.width, config.screen.height, {
      fit: 'cover',
      position: 'top',
    })
    .png()
    .toBuffer();

  // Create text overlay SVG if headline provided
  const composites: sharp.OverlayOptions[] = [
    {
      input: resizedScreenshot,
      top: config.screen.y,
      left: config.screen.x,
    },
  ];

  // Add headline text if provided
  if (options.headline) {
    const textSvg = createImageTemplateTextSvg(
      config.width,
      config.text,
      options.headline,
      options.fontFamily
    );
    composites.push({
      input: Buffer.from(textSvg),
      top: 0,
      left: 0,
    });
  }

  // Composite: template + screenshot + text
  return sharp(templateBuffer)
    .composite(composites)
    .png()
    .toBuffer();
}

/**
 * Create text SVG for image template
 */
function createImageTemplateTextSvg(
  width: number,
  textConfig: {
    x: number;
    y: number;
    maxWidth: number;
    fontSize: number;
    lineHeight: number;
    color: string;
    fontWeight: string;
  },
  headline: string,
  fontFamily?: string
): string {
  // Split headline into lines
  const words = headline.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    // Rough estimate: 0.6 chars per fontSize unit
    const estimatedWidth = testLine.length * textConfig.fontSize * 0.5;

    if (estimatedWidth <= textConfig.maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Escape special characters
  const escapedLines = lines.map(line =>
    line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  );

  // Create text elements
  const textElements = escapedLines
    .map((line, i) =>
      `<text x="${textConfig.x}" y="${textConfig.y + i * textConfig.lineHeight}"
            font-family="'${fontFamily || 'Inter'}', 'SF Pro Display', system-ui, sans-serif"
            font-size="${textConfig.fontSize}"
            font-weight="${textConfig.fontWeight}"
            fill="${textConfig.color}"
            text-anchor="middle"
            dominant-baseline="middle">${line}</text>`
    )
    .join('\n  ');

  return `
<svg width="${width}" height="${textConfig.y + lines.length * textConfig.lineHeight + 100}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
  </style>
  ${textElements}
</svg>`;
}

/**
 * Template: Gradient - Screenshot with gradient background (no frame)
 */
async function renderGradientTemplate(
  screenshotBuffer: Buffer,
  options: MockupOptions
): Promise<Buffer> {
  const frame = getDeviceFrame(options.deviceType)!;

  // Calculate centered position
  const padding = 80;
  const maxWidth = frame.frameWidth - padding * 2;
  const maxHeight = frame.frameHeight - padding * 2;
  const scale = Math.min(maxWidth / frame.screenWidth, maxHeight / frame.screenHeight);
  const scaledWidth = Math.round(frame.screenWidth * scale);
  const scaledHeight = Math.round(frame.screenHeight * scale);
  const x = Math.round((frame.frameWidth - scaledWidth) / 2);
  const y = Math.round((frame.frameHeight - scaledHeight) / 2);

  // Resize screenshot
  const resizedScreenshot = await sharp(screenshotBuffer)
    .resize(scaledWidth, scaledHeight)
    .png()
    .toBuffer();

  // Create rounded screenshot
  const radius = Math.round(40 * scale);
  const roundedScreenshot = await createRoundedImage(
    resizedScreenshot,
    scaledWidth,
    scaledHeight,
    radius
  );

  // Create gradient background
  const gradientSvg = createGradientSvg(
    frame.frameWidth,
    frame.frameHeight,
    options.backgroundColor,
    adjustColor(options.backgroundColor, -30)
  );

  const gradientBg = await sharp(Buffer.from(gradientSvg))
    .png()
    .toBuffer();

  // Composite
  return sharp(gradientBg)
    .composite([
      {
        input: roundedScreenshot,
        top: y,
        left: x,
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Template: Text Overlay - Screenshot with headline text
 */
async function renderTextOverlayTemplate(
  screenshotBuffer: Buffer,
  options: MockupOptions
): Promise<Buffer> {
  const frame = getDeviceFrame(options.deviceType)!;

  // Reserve space for headline (top 20%)
  const headlineHeight = Math.round(frame.frameHeight * 0.2);
  const screenshotAreaTop = headlineHeight;
  const screenshotAreaHeight = frame.frameHeight - headlineHeight;

  // Calculate screenshot position
  const padding = 60;
  const maxWidth = frame.frameWidth - padding * 2;
  const maxHeight = screenshotAreaHeight - padding * 2;
  const scale = Math.min(maxWidth / frame.screenWidth, maxHeight / frame.screenHeight);
  const scaledWidth = Math.round(frame.screenWidth * scale);
  const scaledHeight = Math.round(frame.screenHeight * scale);
  const x = Math.round((frame.frameWidth - scaledWidth) / 2);
  const y = screenshotAreaTop + Math.round((screenshotAreaHeight - scaledHeight) / 2);

  // Resize screenshot
  const resizedScreenshot = await sharp(screenshotBuffer)
    .resize(scaledWidth, scaledHeight)
    .png()
    .toBuffer();

  // Create rounded screenshot
  const radius = Math.round(30 * scale);
  const roundedScreenshot = await createRoundedImage(
    resizedScreenshot,
    scaledWidth,
    scaledHeight,
    radius
  );

  // Create background with headline
  const bgSvg = createTextOverlaySvg(
    frame.frameWidth,
    frame.frameHeight,
    options.backgroundColor,
    options.headline || '',
    headlineHeight,
    options.fontFamily
  );

  const background = await sharp(Buffer.from(bgSvg))
    .png()
    .toBuffer();

  // Composite
  return sharp(background)
    .composite([
      {
        input: roundedScreenshot,
        top: y,
        left: x,
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Template: App Store - Todoist style with pastel background, headline, and rounded screenshot
 */
async function renderAppStoreTemplate(
  screenshotBuffer: Buffer,
  options: MockupOptions
): Promise<Buffer> {
  const frame = getDeviceFrame(options.deviceType)!;

  // Canvas dimensions (App Store standard)
  const canvasWidth = frame.frameWidth;
  const canvasHeight = frame.frameHeight;

  // Reserve space for headline (top 25%)
  const headlineAreaHeight = Math.round(canvasHeight * 0.25);
  const screenshotAreaTop = headlineAreaHeight;
  const screenshotAreaHeight = canvasHeight - headlineAreaHeight;

  // Calculate screenshot size and position (centered, with padding)
  const padding = 60;
  const maxWidth = canvasWidth - padding * 2;
  const maxHeight = screenshotAreaHeight - padding;
  const scale = Math.min(maxWidth / frame.screenWidth, maxHeight / frame.screenHeight);
  const scaledWidth = Math.round(frame.screenWidth * scale);
  const scaledHeight = Math.round(frame.screenHeight * scale);
  const x = Math.round((canvasWidth - scaledWidth) / 2);
  const y = screenshotAreaTop + Math.round((screenshotAreaHeight - scaledHeight) / 2);

  // Resize screenshot
  const resizedScreenshot = await sharp(screenshotBuffer)
    .resize(scaledWidth, scaledHeight)
    .png()
    .toBuffer();

  // Create rounded screenshot with large radius (Todoist style)
  const radius = Math.round(44 * scale); // Large rounded corners
  const roundedScreenshot = await createRoundedImage(
    resizedScreenshot,
    scaledWidth,
    scaledHeight,
    radius
  );

  // Add subtle shadow to screenshot
  const shadowOffset = 8;
  const shadowBlur = 30;
  const screenshotWithShadow = await addShadowToImage(
    roundedScreenshot,
    scaledWidth,
    scaledHeight,
    shadowOffset,
    shadowBlur
  );

  // Create background with gradient and headline
  const bgSvg = createAppStoreSvg(
    canvasWidth,
    canvasHeight,
    options.backgroundColor,
    adjustColor(options.backgroundColor, -15),
    options.headline || '',
    headlineAreaHeight,
    options.fontFamily
  );

  const background = await sharp(Buffer.from(bgSvg))
    .png()
    .toBuffer();

  // Composite: background + screenshot with shadow
  return sharp(background)
    .composite([
      {
        input: screenshotWithShadow,
        top: y - shadowOffset,
        left: x - shadowOffset,
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Add drop shadow to an image
 */
async function addShadowToImage(
  imageBuffer: Buffer,
  width: number,
  height: number,
  offset: number,
  blur: number
): Promise<Buffer> {
  const shadowWidth = width + offset * 2 + blur * 2;
  const shadowHeight = height + offset * 2 + blur * 2;

  // Create shadow layer (semi-transparent black rectangle with blur)
  const shadowSvg = `
<svg width="${shadowWidth}" height="${shadowHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur / 2}"/>
      <feOffset dx="0" dy="${offset / 2}"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.25"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect x="${blur}" y="${blur}" width="${width}" height="${height}" rx="44" fill="black" filter="url(#shadow)"/>
</svg>`;

  const shadowLayer = await sharp(Buffer.from(shadowSvg))
    .png()
    .toBuffer();

  // Composite image on top of shadow
  return sharp(shadowLayer)
    .composite([
      {
        input: imageBuffer,
        top: blur,
        left: blur,
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Create App Store style SVG background with gradient and headline
 */
function createAppStoreSvg(
  width: number,
  height: number,
  color1: string,
  color2: string,
  headline: string,
  headlineHeight: number,
  fontFamily?: string
): string {
  const textColor = getContrastColor(color1);
  const fontSize = Math.round(width * 0.055);
  const lineHeight = fontSize * 1.2;

  // Split headline into lines if too long (max ~20 chars per line for this style)
  const words = headline.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= 22) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Escape special characters
  const escapedLines = lines.map(line =>
    line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  );

  // Calculate vertical position for centered text
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = (headlineHeight - totalTextHeight) / 2 + fontSize;

  const textElements = escapedLines
    .map((line, i) =>
      `<text x="${width / 2}" y="${textStartY + i * lineHeight}"
            font-family="'${fontFamily || 'SF Pro Display'}', 'Inter', system-ui, sans-serif"
            font-size="${fontSize}"
            font-weight="700"
            fill="${textColor}"
            text-anchor="middle"
            dominant-baseline="middle">${line}</text>`
    )
    .join('\n  ');

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${color1}"/>
      <stop offset="100%" style="stop-color:${color2}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  ${textElements}
</svg>`;
}

// SVG Helper functions

function createFrameSvg(
  frame: ReturnType<typeof getDeviceFrame>,
  colors: ReturnType<typeof getDeviceColors>
): string {
  const f = frame!;
  const bezelInset = f.bezelWidth / 2;
  const screenRadius = f.cornerRadius - f.bezelWidth;

  let notchSvg = '';
  if (f.notchHeight) {
    const notchWidth = f.screenWidth * 0.35;
    const notchX = f.screenOffsetX + (f.screenWidth - notchWidth) / 2;
    notchSvg = `<rect x="${notchX}" y="${f.screenOffsetY}" width="${notchWidth}" height="${f.notchHeight}" rx="30" fill="${colors.frame}"/>`;
  }

  let homeButtonSvg = '';
  if (f.homeButtonRadius) {
    const buttonY = f.screenOffsetY + f.screenHeight + 40;
    const buttonX = f.frameWidth / 2;
    homeButtonSvg = `<circle cx="${buttonX}" cy="${buttonY}" r="${f.homeButtonRadius / 2}" fill="${colors.bezel}"/>`;
  }

  return `
<svg width="${f.frameWidth}" height="${f.frameHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${f.frameWidth}" height="${f.frameHeight}" rx="${f.cornerRadius}" fill="${colors.frame}"/>
  <rect x="${bezelInset}" y="${bezelInset}" width="${f.frameWidth - bezelInset * 2}" height="${f.frameHeight - bezelInset * 2}" rx="${f.cornerRadius - bezelInset}" fill="${colors.bezel}"/>
  <rect x="${f.screenOffsetX}" y="${f.screenOffsetY}" width="${f.screenWidth}" height="${f.screenHeight}" rx="${screenRadius}" fill="#000"/>
  ${notchSvg}
  ${homeButtonSvg}
</svg>`;
}

function createGradientSvg(
  width: number,
  height: number,
  color1: string,
  color2: string
): string {
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1}"/>
      <stop offset="100%" style="stop-color:${color2}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
</svg>`;
}

function createTextOverlaySvg(
  width: number,
  height: number,
  bgColor: string,
  headline: string,
  headlineHeight: number,
  fontFamily?: string
): string {
  const textColor = getContrastColor(bgColor);
  const fontSize = Math.round(width * 0.05);
  const escapedHeadline = headline
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="${width / 2}" y="${headlineHeight / 2}"
        font-family="${fontFamily || 'Inter'}, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="${textColor}"
        text-anchor="middle"
        dominant-baseline="middle">${escapedHeadline}</text>
</svg>`;
}

async function createRoundedImage(
  imageBuffer: Buffer,
  width: number,
  height: number,
  radius: number
): Promise<Buffer> {
  const mask = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
</svg>`);

  return sharp(imageBuffer)
    .resize(width, height)
    .composite([
      {
        input: mask,
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();
}

function parseColor(hex: string): { r: number; g: number; b: number; alpha: number } {
  const num = parseInt(hex.replace('#', ''), 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
    alpha: 1,
  };
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function getContrastColor(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
