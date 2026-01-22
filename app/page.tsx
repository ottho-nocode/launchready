'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// Preset background colors
const BACKGROUND_COLORS = [
  '#2563EB', // Blue
  '#7C3AED', // Violet
  '#DB2777', // Pink
  '#DC2626', // Red
  '#EA580C', // Orange
  '#16A34A', // Green
  '#0891B2', // Cyan
  '#1E293B', // Slate
  '#F5F5F4', // Light gray
];

// Text colors
const TEXT_COLORS = [
  '#FFFFFF',
  '#FEF3C7',
  '#000000',
  '#2563EB',
  '#DC2626',
  '#16A34A',
];

// Canvas and phone dimensions
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 867;
const EXPORT_SCALE = 3.1;

const PHONE_WIDTH = 280;
const PHONE_HEIGHT = 580;
const PHONE_X = (CANVAS_WIDTH - PHONE_WIDTH) / 2;
const PHONE_Y = 200;
const CORNER_RADIUS = 45;
const BEZEL_WIDTH = 8;

// Screen area
const SCREEN_X = PHONE_X + BEZEL_WIDTH + 4;
const SCREEN_Y = PHONE_Y + BEZEL_WIDTH + 4;
const SCREEN_WIDTH = PHONE_WIDTH - (BEZEL_WIDTH + 4) * 2;
const SCREEN_HEIGHT = PHONE_HEIGHT - (BEZEL_WIDTH + 4) * 2;
const SCREEN_RADIUS = CORNER_RADIUS - BEZEL_WIDTH - 4;

export default function MockupEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [backgroundColor, setBackgroundColor] = useState('#2563EB');
  const [screenshot, setScreenshot] = useState<HTMLImageElement | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [headline, setHeadline] = useState('Votre texte\npromotionnel');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textOpacity, setTextOpacity] = useState(100);
  const [fontSize, setFontSize] = useState(36);

  // Draw everything on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw headline text
    ctx.save();
    ctx.globalAlpha = textOpacity / 100;
    ctx.fillStyle = textColor;
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const lines = headline.split('\n');
    const lineHeight = fontSize * 1.2;
    lines.forEach((line, i) => {
      ctx.fillText(line, CANVAS_WIDTH / 2, 50 + i * lineHeight);
    });
    ctx.restore();

    // Draw phone outer frame
    ctx.fillStyle = '#1a1a1a';
    roundRect(ctx, PHONE_X, PHONE_Y, PHONE_WIDTH, PHONE_HEIGHT, CORNER_RADIUS);
    ctx.fill();

    // Draw phone bezel
    ctx.fillStyle = '#2d2d2d';
    roundRect(
      ctx,
      PHONE_X + 4,
      PHONE_Y + 4,
      PHONE_WIDTH - 8,
      PHONE_HEIGHT - 8,
      CORNER_RADIUS - 4
    );
    ctx.fill();

    // Draw screen background (black)
    ctx.fillStyle = '#000000';
    roundRect(ctx, SCREEN_X, SCREEN_Y, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_RADIUS);
    ctx.fill();

    // Draw screenshot if available
    if (screenshot) {
      ctx.save();

      // Create clipping path for screen
      ctx.beginPath();
      roundRect(ctx, SCREEN_X, SCREEN_Y, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_RADIUS);
      ctx.clip();

      // Calculate scale to cover screen
      const imgRatio = screenshot.width / screenshot.height;
      const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgRatio > screenRatio) {
        drawHeight = SCREEN_HEIGHT;
        drawWidth = drawHeight * imgRatio;
        drawX = SCREEN_X - (drawWidth - SCREEN_WIDTH) / 2;
        drawY = SCREEN_Y;
      } else {
        drawWidth = SCREEN_WIDTH;
        drawHeight = drawWidth / imgRatio;
        drawX = SCREEN_X;
        drawY = SCREEN_Y;
      }

      ctx.drawImage(screenshot, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    }

    // Draw notch
    const notchWidth = 90;
    const notchHeight = 28;
    const notchX = PHONE_X + (PHONE_WIDTH - notchWidth) / 2;
    const notchY = SCREEN_Y;

    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.roundRect(notchX, notchY, notchWidth, notchHeight, [0, 0, 14, 14]);
    ctx.fill();

    // Draw camera in notch
    ctx.fillStyle = '#0d2137';
    ctx.beginPath();
    ctx.arc(notchX + notchWidth - 20, notchY + notchHeight / 2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw speaker in notch
    ctx.fillStyle = '#0d2137';
    ctx.beginPath();
    ctx.roundRect(notchX + 20, notchY + notchHeight / 2 - 2, 40, 4, 2);
    ctx.fill();

  }, [backgroundColor, screenshot, headline, textColor, textOpacity, fontSize]);

  // Redraw when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle screenshot upload
  const handleScreenshotUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setScreenshotPreview(dataUrl);

      const img = new Image();
      img.onload = () => {
        setScreenshot(img);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/') && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, []);

  // Export PNG
  const exportMockup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create high-res canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = CANVAS_WIDTH * EXPORT_SCALE;
    exportCanvas.height = CANVAS_HEIGHT * EXPORT_SCALE;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

    // Redraw everything on export canvas
    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Headline
    ctx.save();
    ctx.globalAlpha = textOpacity / 100;
    ctx.fillStyle = textColor;
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const lines = headline.split('\n');
    const lineHeight = fontSize * 1.2;
    lines.forEach((line, i) => {
      ctx.fillText(line, CANVAS_WIDTH / 2, 50 + i * lineHeight);
    });
    ctx.restore();

    // Phone frame
    ctx.fillStyle = '#1a1a1a';
    roundRect(ctx, PHONE_X, PHONE_Y, PHONE_WIDTH, PHONE_HEIGHT, CORNER_RADIUS);
    ctx.fill();

    ctx.fillStyle = '#2d2d2d';
    roundRect(ctx, PHONE_X + 4, PHONE_Y + 4, PHONE_WIDTH - 8, PHONE_HEIGHT - 8, CORNER_RADIUS - 4);
    ctx.fill();

    ctx.fillStyle = '#000000';
    roundRect(ctx, SCREEN_X, SCREEN_Y, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_RADIUS);
    ctx.fill();

    // Screenshot
    if (screenshot) {
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, SCREEN_X, SCREEN_Y, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_RADIUS);
      ctx.clip();

      const imgRatio = screenshot.width / screenshot.height;
      const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgRatio > screenRatio) {
        drawHeight = SCREEN_HEIGHT;
        drawWidth = drawHeight * imgRatio;
        drawX = SCREEN_X - (drawWidth - SCREEN_WIDTH) / 2;
        drawY = SCREEN_Y;
      } else {
        drawWidth = SCREEN_WIDTH;
        drawHeight = drawWidth / imgRatio;
        drawX = SCREEN_X;
        drawY = SCREEN_Y;
      }

      ctx.drawImage(screenshot, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    }

    // Notch
    const notchWidth = 90;
    const notchHeight = 28;
    const notchX = PHONE_X + (PHONE_WIDTH - notchWidth) / 2;
    const notchY = SCREEN_Y;

    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.roundRect(notchX, notchY, notchWidth, notchHeight, [0, 0, 14, 14]);
    ctx.fill();

    ctx.fillStyle = '#0d2137';
    ctx.beginPath();
    ctx.arc(notchX + notchWidth - 20, notchY + notchHeight / 2, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0d2137';
    ctx.beginPath();
    ctx.roundRect(notchX + 20, notchY + notchHeight / 2 - 2, 40, 4, 2);
    ctx.fill();

    // Download
    const link = document.createElement('a');
    link.download = `mockup-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [backgroundColor, screenshot, headline, textColor, textOpacity, fontSize]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">📱 Mockup Editor</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Canvas */}
          <Card className="p-4">
            <div
              className="mx-auto rounded-lg bg-gray-200 p-3"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: 'fit-content' }}
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={exportMockup} size="lg">
                ⬇️ Télécharger PNG
              </Button>
            </div>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            {/* Background */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">🎨 Couleur de fond</Label>
              <div className="grid grid-cols-5 gap-2">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={cn(
                      'h-10 w-10 rounded-lg border-2 transition-transform',
                      backgroundColor === color
                        ? 'border-black scale-110 ring-2 ring-black/20'
                        : 'border-gray-300 hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded"
                />
                <span className="text-sm text-gray-500">{backgroundColor}</span>
              </div>
            </Card>

            {/* Screenshot */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">🖼️ Screenshot</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
                  screenshotPreview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                )}
              >
                {screenshotPreview ? (
                  <div className="text-center">
                    <img src={screenshotPreview} alt="" className="mx-auto mb-2 h-20 rounded object-contain" />
                    <p className="text-xs text-green-600">Cliquez pour changer</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">📱 Glissez ou cliquez</p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
              />
            </Card>

            {/* Text */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">✏️ Texte</Label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                rows={3}
                placeholder="Votre texte promotionnel"
              />

              <div className="mt-4 space-y-4">
                <div>
                  <Label className="mb-2 block text-sm">Couleur</Label>
                  <div className="flex flex-wrap gap-2">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={cn(
                          'h-8 w-8 rounded border-2',
                          textColor === color ? 'border-black scale-110' : 'border-gray-300'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm">Taille: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(v) => setFontSize(v[0])}
                    min={20}
                    max={60}
                    step={2}
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm">Opacité: {textOpacity}%</Label>
                  <Slider
                    value={[textOpacity]}
                    onValueChange={(v) => setTextOpacity(v[0])}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to draw rounded rectangles
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
