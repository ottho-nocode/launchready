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

export default function MockupEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fabric, setFabric] = useState<any>(null);
  const [backgroundColor, setBackgroundColor] = useState('#2563EB');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textOpacity, setTextOpacity] = useState(100);

  // Canvas dimensions
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 867;
  const EXPORT_SCALE = 3.1; // Export at ~1242x2688

  // Phone dimensions (centered in canvas)
  const PHONE_WIDTH = 320;
  const PHONE_HEIGHT = 660;
  const PHONE_X = (CANVAS_WIDTH - PHONE_WIDTH) / 2;
  const PHONE_Y = 180;

  // Screen area inside phone (where screenshot goes)
  const SCREEN_PADDING = 14;
  const NOTCH_HEIGHT = 34;
  const SCREEN_X = PHONE_X + SCREEN_PADDING;
  const SCREEN_Y = PHONE_Y + SCREEN_PADDING + NOTCH_HEIGHT;
  const SCREEN_WIDTH = PHONE_WIDTH - SCREEN_PADDING * 2;
  const SCREEN_HEIGHT = PHONE_HEIGHT - SCREEN_PADDING * 2 - NOTCH_HEIGHT;

  // Load Fabric.js dynamically (client-side only)
  useEffect(() => {
    import('fabric').then((fabricModule) => {
      setFabric(fabricModule);
    });
  }, []);

  // Initialize canvas when fabric is loaded
  useEffect(() => {
    if (!fabric || !canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: backgroundColor,
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Add phone frame
    addPhoneFrame(canvas, fabric);

    // Add default text
    addText(canvas, fabric, 'Votre texte\npromotionnel', 50);

    // Selection events
    canvas.on('selection:created', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
      updateTextControls(e.selected?.[0]);
    });
    canvas.on('selection:updated', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
      updateTextControls(e.selected?.[0]);
    });
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Keyboard delete
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      // Check if text is being edited (only IText has isEditing)
      const isEditing = 'isEditing' in active && (active as any).isEditing;
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditing) {
        canvas.remove(active);
        canvas.discardActiveObject();
        canvas.renderAll();
        setSelectedObject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    setIsReady(true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [fabric]);

  // Update background
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundColor = backgroundColor;
    fabricRef.current.renderAll();
  }, [backgroundColor]);

  const updateTextControls = (obj: any) => {
    if (obj && obj.type === 'i-text') {
      setTextColor(obj.fill || '#FFFFFF');
      setTextOpacity(Math.round((obj.opacity || 1) * 100));
    }
  };

  // Add phone frame using Fabric shapes grouped together
  const addPhoneFrame = (canvas: any, fabricModule: any) => {
    const cornerRadius = 50;
    const bezelWidth = 6;
    const screenPadding = 14;

    // Outer frame (dark gray)
    const outerFrame = new fabricModule.Rect({
      left: 0,
      top: 0,
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
      rx: cornerRadius,
      ry: cornerRadius,
      fill: '#1a1a1a',
      selectable: false,
      evented: false,
    });

    // Bezel (slightly lighter)
    const bezel = new fabricModule.Rect({
      left: bezelWidth,
      top: bezelWidth,
      width: PHONE_WIDTH - bezelWidth * 2,
      height: PHONE_HEIGHT - bezelWidth * 2,
      rx: cornerRadius - bezelWidth,
      ry: cornerRadius - bezelWidth,
      fill: '#2d2d2d',
      selectable: false,
      evented: false,
    });

    // Screen (black)
    const screen = new fabricModule.Rect({
      left: screenPadding,
      top: screenPadding,
      width: PHONE_WIDTH - screenPadding * 2,
      height: PHONE_HEIGHT - screenPadding * 2,
      rx: cornerRadius - screenPadding,
      ry: cornerRadius - screenPadding,
      fill: '#000000',
      selectable: false,
      evented: false,
    });

    // Notch
    const notchWidth = PHONE_WIDTH * 0.35;
    const notchHeight = 34;
    const notchX = (PHONE_WIDTH - notchWidth) / 2;
    const notch = new fabricModule.Rect({
      left: notchX,
      top: screenPadding,
      width: notchWidth,
      height: notchHeight,
      rx: 17,
      ry: 17,
      fill: '#1a1a1a',
      selectable: false,
      evented: false,
    });

    // Camera
    const camera = new fabricModule.Circle({
      left: notchX + notchWidth - 35,
      top: screenPadding + notchHeight / 2 - 8,
      radius: 8,
      fill: '#0d2137',
      selectable: false,
      evented: false,
    });

    // Speaker
    const speaker = new fabricModule.Rect({
      left: (PHONE_WIDTH - 60) / 2,
      top: screenPadding + 8,
      width: 60,
      height: 6,
      rx: 3,
      ry: 3,
      fill: '#0d2137',
      selectable: false,
      evented: false,
    });

    // Group all phone elements
    const phoneGroup = new fabricModule.Group(
      [outerFrame, bezel, screen, notch, camera, speaker],
      {
        left: PHONE_X,
        top: PHONE_Y,
        selectable: false,
        evented: false,
        name: 'phoneFrame',
      }
    );

    canvas.add(phoneGroup);
    canvas.renderAll();
  };

  // Add text
  const addText = (canvas: any, fabricModule: any, content: string, top: number) => {
    const text = new fabricModule.IText(content, {
      left: CANVAS_WIDTH / 2,
      top: top,
      fontSize: 36,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '700',
      fill: '#FFFFFF',
      textAlign: 'center',
      originX: 'center',
      originY: 'top',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // Handle screenshot upload
  const handleScreenshotUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricRef.current || !fabric) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setScreenshot(dataUrl);

      fabric.Image.fromURL(dataUrl).then((img: any) => {
        const canvas = fabricRef.current;

        // Remove existing screenshot
        const objects = canvas.getObjects();
        for (const obj of objects) {
          if ((obj as any).name === 'screenshot') {
            canvas.remove(obj);
            break;
          }
        }

        // Scale to fit screen area
        const scaleX = SCREEN_WIDTH / img.width;
        const scaleY = SCREEN_HEIGHT / img.height;
        const scale = Math.max(scaleX, scaleY);

        img.set({
          left: SCREEN_X + SCREEN_WIDTH / 2,
          top: SCREEN_Y,
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'top',
          selectable: false,
          evented: false,
          name: 'screenshot',
        });

        // Clip to screen area
        img.clipPath = new fabric.Rect({
          left: SCREEN_X,
          top: SCREEN_Y,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          rx: 26,
          ry: 26,
          absolutePositioned: true,
        });

        // Find phone frame and insert screenshot before it (behind)
        const phoneFrameIndex = objects.findIndex((obj: any) => (obj as any).name === 'phoneFrame');
        if (phoneFrameIndex >= 0) {
          canvas.insertAt(phoneFrameIndex, img);
        } else {
          canvas.add(img);
        }
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  }, [fabric]);

  // Drag and drop
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

  // Delete selected
  const deleteSelected = useCallback(() => {
    if (!fabricRef.current || !selectedObject) return;
    fabricRef.current.remove(selectedObject);
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    setSelectedObject(null);
  }, [selectedObject]);

  // Add new text
  const handleAddText = useCallback(() => {
    if (!fabricRef.current || !fabric) return;
    addText(fabricRef.current, fabric, 'Nouveau texte', 100);
  }, [fabric]);

  // Update text color
  const handleTextColorChange = useCallback((color: string) => {
    setTextColor(color);
    if (selectedObject?.type === 'i-text') {
      selectedObject.set('fill', color);
      fabricRef.current?.renderAll();
    }
  }, [selectedObject]);

  // Update text opacity
  const handleTextOpacityChange = useCallback((value: number[]) => {
    const opacity = value[0];
    setTextOpacity(opacity);
    if (selectedObject?.type === 'i-text') {
      selectedObject.set('opacity', opacity / 100);
      fabricRef.current?.renderAll();
    }
  }, [selectedObject]);

  // Export PNG
  const exportMockup = useCallback(() => {
    if (!fabricRef.current) return;
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();

    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      multiplier: EXPORT_SCALE,
    });

    const link = document.createElement('a');
    link.download = `mockup-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  const isTextSelected = selectedObject?.type === 'i-text';

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">
          📱 Mockup Editor
        </h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Canvas */}
          <Card className="p-4">
            <div
              className="mx-auto rounded-lg bg-gray-200 p-3"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: 'fit-content' }}
            >
              <canvas ref={canvasRef} className="rounded-lg shadow-xl" />
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={exportMockup} disabled={!isReady} size="lg">
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
                  screenshot ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                )}
              >
                {screenshot ? (
                  <div className="text-center">
                    <img src={screenshot} alt="" className="mx-auto mb-2 h-20 rounded object-contain" />
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
              <Button onClick={handleAddText} variant="outline" className="w-full mb-3">
                + Ajouter du texte
              </Button>

              {isTextSelected && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label className="mb-2 block text-sm">Couleur</Label>
                    <div className="flex flex-wrap gap-2">
                      {TEXT_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleTextColorChange(color)}
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
                        onChange={(e) => handleTextColorChange(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm">Opacité: {textOpacity}%</Label>
                    <Slider
                      value={[textOpacity]}
                      onValueChange={handleTextOpacityChange}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <Button onClick={deleteSelected} variant="destructive" className="w-full">
                    🗑️ Supprimer
                  </Button>
                </div>
              )}

              <p className="mt-3 text-xs text-gray-500">
                Double-clic = éditer • Glisser = déplacer • Suppr = supprimer
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
