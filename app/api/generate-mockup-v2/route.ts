import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { z } from 'zod';

// Template configurations - all generated programmatically
const TEMPLATES: Record<string, {
  name: string;
  width: number;
  height: number;
  background: {
    color1: string;
    color2: string;
    waveColor: string;
  };
  phone: {
    x: number;
    y: number;
    width: number;
    height: number;
    screenPadding: number;
    cornerRadius: number;
    frameColor: string;
    bezelColor: string;
  };
  text: {
    y: number;
    fontSize: number;
    lineHeight: number;
    color: string;
    maxLines: number;
  };
}> = {
  'blue-waves': {
    name: 'Blue Waves',
    width: 1242,
    height: 2688,
    background: {
      color1: '#2563EB', // Blue 600
      color2: '#1E40AF', // Blue 800
      waveColor: '#1D4ED8', // Blue 700
    },
    phone: {
      x: 100,
      y: 450,
      width: 1042,
      height: 2200,
      screenPadding: 20,
      cornerRadius: 70,
      frameColor: '#1a1a1a',
      bezelColor: '#2a2a2a',
    },
    text: {
      y: 120,
      fontSize: 72,
      lineHeight: 90,
      color: '#FEF3C7', // Amber 100 (cream)
      maxLines: 4,
    },
  },
};

const requestSchema = z.object({
  templateId: z.string(),
  screenshot: z.string().min(1, 'Screenshot is required (base64)'),
  headline: z.string().default(''),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { templateId, screenshot, headline } = parsed.data;

    // Get template config
    const template = TEMPLATES[templateId];
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Generate background SVG
    const backgroundSvg = createBackgroundSvg(template);
    const backgroundBuffer = await sharp(Buffer.from(backgroundSvg))
      .png()
      .toBuffer();

    // Decode base64 screenshot
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');
    const screenshotBuffer = Buffer.from(base64Data, 'base64');

    // Calculate screen dimensions (inside the phone frame)
    const screenWidth = template.phone.width - template.phone.screenPadding * 2;
    const screenHeight = template.phone.height - template.phone.screenPadding * 2 - 40; // -40 for notch area
    const screenX = template.phone.x + template.phone.screenPadding;
    const screenY = template.phone.y + template.phone.screenPadding + 40; // +40 for notch

    // Resize and round screenshot to fit screen
    const resizedScreenshot = await sharp(screenshotBuffer)
      .resize(screenWidth, screenHeight, {
        fit: 'cover',
        position: 'top',
      })
      .png()
      .toBuffer();

    // Create rounded mask for screenshot
    const roundedScreenshot = await createRoundedImage(
      resizedScreenshot,
      screenWidth,
      screenHeight,
      template.phone.cornerRadius - template.phone.screenPadding
    );

    // Create phone frame SVG
    const phoneSvg = createPhoneFrameSvg(template);
    const phoneBuffer = await sharp(Buffer.from(phoneSvg))
      .png()
      .toBuffer();

    // Build composites array
    const composites: sharp.OverlayOptions[] = [
      // Phone frame
      {
        input: phoneBuffer,
        top: template.phone.y,
        left: template.phone.x,
      },
      // Screenshot inside phone
      {
        input: roundedScreenshot,
        top: screenY,
        left: screenX,
      },
    ];

    // Add headline text if provided
    if (headline.trim()) {
      const textSvg = createTextSvg(template, headline);
      composites.push({
        input: Buffer.from(textSvg),
        top: 0,
        left: 0,
      });
    }

    // Composite everything
    const result = await sharp(backgroundBuffer)
      .composite(composites)
      .png()
      .toBuffer();

    // Return PNG image
    return new NextResponse(new Uint8Array(result), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': result.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Mockup generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Create background with gradient and wave pattern
 */
function createBackgroundSvg(template: typeof TEMPLATES[string]): string {
  const { width, height, background } = template;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${background.color1}"/>
      <stop offset="100%" style="stop-color:${background.color2}"/>
    </linearGradient>
  </defs>

  <!-- Main background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

  <!-- Decorative wave arcs -->
  <ellipse cx="${width / 2}" cy="${height * 0.35}" rx="${width * 0.9}" ry="${height * 0.15}"
           fill="none" stroke="${background.waveColor}" stroke-width="80" opacity="0.3"/>
  <ellipse cx="${width / 2}" cy="${height * 0.25}" rx="${width * 1.1}" ry="${height * 0.18}"
           fill="none" stroke="${background.waveColor}" stroke-width="60" opacity="0.2"/>
</svg>`;
}

/**
 * Create iPhone frame SVG
 */
function createPhoneFrameSvg(template: typeof TEMPLATES[string]): string {
  const { phone } = template;
  const { width, height, cornerRadius, frameColor, bezelColor, screenPadding } = phone;

  // Notch dimensions
  const notchWidth = width * 0.35;
  const notchHeight = 35;
  const notchX = (width - notchWidth) / 2;

  // Screen area
  const screenRadius = cornerRadius - screenPadding;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer frame -->
  <rect x="0" y="0" width="${width}" height="${height}" rx="${cornerRadius}" fill="${frameColor}"/>

  <!-- Inner bezel -->
  <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="${cornerRadius - 8}" fill="${bezelColor}"/>

  <!-- Screen (black background) -->
  <rect x="${screenPadding}" y="${screenPadding}"
        width="${width - screenPadding * 2}" height="${height - screenPadding * 2}"
        rx="${screenRadius}" fill="#000"/>

  <!-- Notch -->
  <rect x="${notchX}" y="${screenPadding}" width="${notchWidth}" height="${notchHeight}"
        rx="18" fill="${frameColor}"/>

  <!-- Camera dot in notch -->
  <circle cx="${notchX + notchWidth - 35}" cy="${screenPadding + notchHeight / 2}" r="8" fill="#1a3a5c"/>

  <!-- Side buttons (volume) -->
  <rect x="-4" y="280" width="4" height="60" rx="2" fill="${bezelColor}"/>
  <rect x="-4" y="360" width="4" height="60" rx="2" fill="${bezelColor}"/>

  <!-- Side button (power) -->
  <rect x="${width}" y="320" width="4" height="80" rx="2" fill="${bezelColor}"/>
</svg>`;
}

/**
 * Create text SVG overlay
 */
function createTextSvg(
  template: typeof TEMPLATES[string],
  headline: string
): string {
  const { width, text } = template;

  // Split by newlines
  const lines = headline.split('\n').map(line => line.trim()).filter(Boolean);

  // Limit to max lines
  const displayLines = lines.slice(0, text.maxLines);

  // Escape special characters
  const escapedLines = displayLines.map(line =>
    line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  );

  // Create text elements
  const textElements = escapedLines
    .map((line, i) =>
      `<text x="${width / 2}" y="${text.y + i * text.lineHeight}"
            font-family="'SF Pro Display', 'Inter', 'Helvetica Neue', system-ui, sans-serif"
            font-size="${text.fontSize}"
            font-weight="700"
            fill="${text.color}"
            text-anchor="middle"
            dominant-baseline="middle">${line}</text>`
    )
    .join('\n  ');

  const svgHeight = text.y + displayLines.length * text.lineHeight + 50;

  return `<svg width="${width}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  ${textElements}
</svg>`;
}

/**
 * Create rounded image with mask
 */
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
