import sharp from 'sharp';
import type { DeviceColor, DeviceType, MockupTemplate } from '@/types/app';
import { getDeviceColors, getDeviceFrame } from './device-frames';

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
      result = await renderFrameTemplate(processedScreenshot, options);
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
 */
async function renderFrameTemplate(
  screenshotBuffer: Buffer,
  options: MockupOptions
): Promise<Buffer> {
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
