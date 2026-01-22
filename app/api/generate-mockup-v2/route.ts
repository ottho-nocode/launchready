import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { z } from 'zod';

// Template configurations
const TEMPLATES: Record<string, {
  imagePath: string;
  width: number;
  height: number;
  screen: { x: number; y: number; width: number; height: number };
  text: { x: number; y: number; fontSize: number; lineHeight: number; color: string };
}> = {
  'blue-waves': {
    imagePath: '/templates/frame-template.jpg',
    width: 1242,
    height: 2688,
    screen: {
      x: 149,
      y: 427,
      width: 939,
      height: 2260,
    },
    text: {
      x: 621,
      y: 180,
      fontSize: 75,
      lineHeight: 95,
      color: '#F5F5DC',
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

    // Load the template image
    const templatePath = path.join(process.cwd(), 'public', template.imagePath);
    const templateBuffer = await sharp(templatePath).png().toBuffer();

    // Decode base64 screenshot
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');
    const screenshotBuffer = Buffer.from(base64Data, 'base64');

    // Resize screenshot to fit the screen area
    const resizedScreenshot = await sharp(screenshotBuffer)
      .resize(template.screen.width, template.screen.height, {
        fit: 'cover',
        position: 'top',
      })
      .png()
      .toBuffer();

    // Build composites array
    const composites: sharp.OverlayOptions[] = [
      {
        input: resizedScreenshot,
        top: template.screen.y,
        left: template.screen.x,
      },
    ];

    // Add headline text if provided
    if (headline.trim()) {
      const textSvg = createTextSvg(
        template.width,
        template.text,
        headline
      );
      composites.push({
        input: Buffer.from(textSvg),
        top: 0,
        left: 0,
      });
    }

    // Composite: template + screenshot + text
    const result = await sharp(templateBuffer)
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

function createTextSvg(
  width: number,
  textConfig: {
    x: number;
    y: number;
    fontSize: number;
    lineHeight: number;
    color: string;
  },
  headline: string
): string {
  // Split by newlines (user-defined line breaks)
  const lines = headline.split('\n').map(line => line.trim()).filter(Boolean);

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
            font-family="'SF Pro Display', 'Inter', 'Helvetica Neue', system-ui, sans-serif"
            font-size="${textConfig.fontSize}"
            font-weight="700"
            fill="${textConfig.color}"
            text-anchor="middle"
            dominant-baseline="middle">${line}</text>`
    )
    .join('\n  ');

  const svgHeight = textConfig.y + lines.length * textConfig.lineHeight + 50;

  return `<svg width="${width}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  ${textElements}
</svg>`;
}
