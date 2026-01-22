'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import * as fabric from 'fabric';

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

export default function MockupEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const phoneGroupRef = useRef<fabric.Group | null>(null);
  const screenshotRef = useRef<fabric.Image | null>(null);
  const textRef = useRef<fabric.IText | null>(null);

  const [backgroundColor, setBackgroundColor] = useState('#2563EB');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Canvas dimensions (iPhone 6.5" aspect ratio)
  const CANVAS_WIDTH = 414;
  const CANVAS_HEIGHT = 896;
  const EXPORT_SCALE = 3; // Export at 1242x2688

  // Phone dimensions relative to canvas
  const PHONE_WIDTH = CANVAS_WIDTH * 0.85;
  const PHONE_HEIGHT = CANVAS_HEIGHT * 0.78;
  const PHONE_X = (CANVAS_WIDTH - PHONE_WIDTH) / 2;
  const PHONE_Y = CANVAS_HEIGHT * 0.20;
  const PHONE_RADIUS = 35;
  const PHONE_BEZEL = 8;

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: backgroundColor,
      selection: true,
    });

    fabricRef.current = canvas;

    // Create phone frame
    createPhoneFrame(canvas);

    // Create default editable text
    createEditableText(canvas);

    setIsReady(true);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Update background color
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundColor = backgroundColor;
    fabricRef.current.renderAll();
  }, [backgroundColor]);

  // Create phone frame group
  const createPhoneFrame = (canvas: fabric.Canvas) => {
    // Phone outer frame
    const phoneFrame = new fabric.Rect({
      left: 0,
      top: 0,
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
      rx: PHONE_RADIUS,
      ry: PHONE_RADIUS,
      fill: '#1a1a1a',
      selectable: false,
    });

    // Phone bezel
    const phoneBezel = new fabric.Rect({
      left: 4,
      top: 4,
      width: PHONE_WIDTH - 8,
      height: PHONE_HEIGHT - 8,
      rx: PHONE_RADIUS - 4,
      ry: PHONE_RADIUS - 4,
      fill: '#2a2a2a',
      selectable: false,
    });

    // Phone screen (black background for screenshot)
    const phoneScreen = new fabric.Rect({
      left: PHONE_BEZEL,
      top: PHONE_BEZEL,
      width: PHONE_WIDTH - PHONE_BEZEL * 2,
      height: PHONE_HEIGHT - PHONE_BEZEL * 2,
      rx: PHONE_RADIUS - PHONE_BEZEL,
      ry: PHONE_RADIUS - PHONE_BEZEL,
      fill: '#000000',
      selectable: false,
    });

    // Notch
    const notchWidth = PHONE_WIDTH * 0.35;
    const notch = new fabric.Rect({
      left: (PHONE_WIDTH - notchWidth) / 2,
      top: PHONE_BEZEL,
      width: notchWidth,
      height: 25,
      rx: 12,
      ry: 12,
      fill: '#1a1a1a',
      selectable: false,
    });

    // Camera dot
    const camera = new fabric.Circle({
      left: (PHONE_WIDTH - notchWidth) / 2 + notchWidth - 25,
      top: PHONE_BEZEL + 8,
      radius: 5,
      fill: '#1a3a5c',
      selectable: false,
    });

    // Group all phone elements
    const phoneGroup = new fabric.Group([phoneFrame, phoneBezel, phoneScreen, notch, camera], {
      left: PHONE_X,
      top: PHONE_Y,
      selectable: false,
      evented: false,
    });

    canvas.add(phoneGroup);
    phoneGroupRef.current = phoneGroup;
  };

  // Create editable text
  const createEditableText = (canvas: fabric.Canvas) => {
    const text = new fabric.IText('Votre texte\npromotionnel', {
      left: CANVAS_WIDTH / 2,
      top: 60,
      fontSize: 32,
      fontFamily: 'Inter, SF Pro Display, system-ui, sans-serif',
      fontWeight: 'bold',
      fill: '#FEF3C7',
      textAlign: 'center',
      originX: 'center',
      originY: 'top',
      editable: true,
      selectable: true,
    });

    canvas.add(text);
    textRef.current = text;
  };

  // Handle screenshot upload
  const handleScreenshotUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setScreenshot(dataUrl);

      // Load image into fabric
      fabric.Image.fromURL(dataUrl).then((img) => {
        const canvas = fabricRef.current!;

        // Remove previous screenshot
        if (screenshotRef.current) {
          canvas.remove(screenshotRef.current);
        }

        // Calculate screen area
        const screenX = PHONE_X + PHONE_BEZEL;
        const screenY = PHONE_Y + PHONE_BEZEL + 25; // +25 for notch
        const screenWidth = PHONE_WIDTH - PHONE_BEZEL * 2;
        const screenHeight = PHONE_HEIGHT - PHONE_BEZEL * 2 - 25;

        // Scale image to fit screen
        const scaleX = screenWidth / img.width!;
        const scaleY = screenHeight / img.height!;
        const scale = Math.max(scaleX, scaleY);

        img.set({
          left: screenX,
          top: screenY,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });

        // Clip to screen bounds
        img.clipPath = new fabric.Rect({
          left: screenX,
          top: screenY,
          width: screenWidth,
          height: screenHeight,
          rx: PHONE_RADIUS - PHONE_BEZEL,
          ry: PHONE_RADIUS - PHONE_BEZEL,
          absolutePositioned: true,
        });

        canvas.add(img);
        screenshotRef.current = img;

        // Ensure proper layer order
        if (phoneGroupRef.current) {
          canvas.bringObjectToFront(phoneGroupRef.current);
          // But keep notch on top
        }
        if (textRef.current) {
          canvas.bringObjectToFront(textRef.current);
        }

        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Create a fake event to reuse the upload handler
      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleScreenshotUpload(fakeEvent);
    }
  }, [handleScreenshotUpload]);

  // Export as PNG
  const exportMockup = useCallback(() => {
    if (!fabricRef.current) return;

    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      multiplier: EXPORT_SCALE,
    });

    const link = document.createElement('a');
    link.download = `mockup-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  // Add new text
  const addNewText = useCallback(() => {
    if (!fabricRef.current) return;

    const text = new fabric.IText('Nouveau texte', {
      left: CANVAS_WIDTH / 2,
      top: 120,
      fontSize: 24,
      fontFamily: 'Inter, SF Pro Display, system-ui, sans-serif',
      fontWeight: 'bold',
      fill: '#FFFFFF',
      textAlign: 'center',
      originX: 'center',
      originY: 'top',
      editable: true,
      selectable: true,
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    fabricRef.current.renderAll();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">Mockup Editor</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Canvas Area */}
          <Card className="overflow-hidden p-4">
            <div
              className="mx-auto flex items-center justify-center rounded-lg bg-gray-200 p-4"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ maxWidth: CANVAS_WIDTH + 32 }}
            >
              <canvas ref={canvasRef} className="rounded-lg shadow-lg" />
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <Button onClick={exportMockup} disabled={!isReady}>
                Telecharger PNG
              </Button>
            </div>
          </Card>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Background Color */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">Couleur de fond</Label>
              <div className="grid grid-cols-5 gap-2">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={cn(
                      'h-10 w-10 rounded-lg border-2 transition-all',
                      backgroundColor === color
                        ? 'border-black ring-2 ring-black/20 scale-110'
                        : 'border-transparent hover:scale-105'
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
                  className="h-10 w-10 cursor-pointer rounded border-0"
                />
                <span className="text-sm text-gray-500">{backgroundColor}</span>
              </div>
            </Card>

            {/* Screenshot Upload */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">Screenshot</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
                  screenshot
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                {screenshot ? (
                  <div className="text-center">
                    <img
                      src={screenshot}
                      alt="Screenshot"
                      className="mx-auto mb-2 h-20 rounded object-contain"
                    />
                    <p className="text-xs text-green-600">Cliquez pour changer</p>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl">📱</div>
                    <p className="text-sm text-gray-600">Glissez ou cliquez</p>
                  </>
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

            {/* Text Controls */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">Texte</Label>
              <Button onClick={addNewText} variant="outline" className="w-full">
                + Ajouter du texte
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                Double-cliquez sur le texte pour l&apos;editer.
                Glissez pour le deplacer.
              </p>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-900">Instructions</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Uploadez votre screenshot</li>
                <li>• Choisissez la couleur de fond</li>
                <li>• Double-cliquez pour editer le texte</li>
                <li>• Glissez le texte pour le positionner</li>
                <li>• Telechargez en PNG (1242x2688)</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
