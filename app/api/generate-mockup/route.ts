import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateMockup } from '@/lib/mockup';
import type { DeviceColor, DeviceType, MockupTemplate } from '@/types/app';

const requestSchema = z.object({
  screenshot: z.string().min(1, 'Screenshot is required (base64)'),
  deviceType: z.enum(['iphone-6.7', 'iphone-6.5', 'iphone-6.1', 'iphone-5.5', 'ipad-12.9']),
  deviceColor: z.enum(['black', 'white', 'gold']).default('black'),
  template: z.enum(['app-store', 'frame', 'gradient', 'text-overlay']).default('app-store'),
  backgroundColor: z.string().default('#6366f1'),
  headline: z.string().optional(),
  fontFamily: z.string().optional(),
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

    const {
      screenshot,
      deviceType,
      deviceColor,
      template,
      backgroundColor,
      headline,
      fontFamily,
    } = parsed.data;

    // Decode base64 screenshot
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');
    const screenshotBuffer = Buffer.from(base64Data, 'base64');

    // Generate mockup
    const result = await generateMockup(screenshotBuffer, {
      deviceType: deviceType as DeviceType,
      deviceColor: deviceColor as DeviceColor,
      template: template as MockupTemplate,
      backgroundColor,
      headline,
      fontFamily,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate mockup' },
        { status: 500 }
      );
    }

    // Return PNG image
    return new NextResponse(new Uint8Array(result.buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': result.buffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Mockup generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
