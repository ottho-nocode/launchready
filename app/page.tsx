'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  Trash,
  Plus,
  TextT,
  Download,
  Image as ImageIcon,
  Palette,
  Eye,
} from '@phosphor-icons/react';
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

// Text colors
const TEXT_COLORS = [
  '#FFFFFF', // White
  '#FEF3C7', // Cream
  '#000000', // Black
  '#2563EB', // Blue
  '#DC2626', // Red
  '#16A34A', // Green
];

export default function MockupEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [backgroundColor, setBackgroundColor] = useState('#2563EB');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textOpacity, setTextOpacity] = useState(100);

  // Canvas dimensions (iPhone 6.5" aspect ratio scaled down for display)
  const CANVAS_WIDTH = 414;
  const CANVAS_HEIGHT = 896;
  const EXPORT_SCALE = 3; // Export at 1242x2688

  // Phone dimensions
  const PHONE_WIDTH = 340;
  const PHONE_HEIGHT = 700;
  const PHONE_RADIUS = 40;
  const BEZEL = 12;
  const NOTCH_HEIGHT = 30;

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: backgroundColor,
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Add phone frame
    addPhoneFrame(canvas);

    // Add default text
    addText(canvas, 'Votre texte\npromotionnel', 50);

    // Listen for selection changes
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
      updateTextControls(e.selected?.[0]);
    });
    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
      updateTextControls(e.selected?.[0]);
    });
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Keyboard delete
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = canvas.getActiveObject();
      const isEditing = active && 'isEditing' in active && (active as fabric.IText).isEditing;
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditing) {
        if (active && active.type !== 'group') {
          canvas.remove(active);
          canvas.discardActiveObject();
          canvas.renderAll();
          setSelectedObject(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    setIsReady(true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Update text controls when selection changes
  const updateTextControls = (obj: fabric.Object | undefined) => {
    if (obj && obj.type === 'i-text') {
      const textObj = obj as fabric.IText;
      setTextColor(textObj.fill as string || '#FFFFFF');
      setTextOpacity(Math.round((textObj.opacity || 1) * 100));
    }
  };

  // Update background color
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundColor = backgroundColor;
    fabricRef.current.renderAll();
  }, [backgroundColor]);

  // Add phone frame to canvas
  const addPhoneFrame = (canvas: fabric.Canvas) => {
    const phoneX = (CANVAS_WIDTH - PHONE_WIDTH) / 2;
    const phoneY = 180;

    // Phone outer frame
    const phoneFrame = new fabric.Rect({
      left: phoneX,
      top: phoneY,
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
      rx: PHONE_RADIUS,
      ry: PHONE_RADIUS,
      fill: '#1a1a1a',
      selectable: false,
      evented: false,
      name: 'phoneFrame',
    });

    // Phone bezel
    const phoneBezel = new fabric.Rect({
      left: phoneX + 4,
      top: phoneY + 4,
      width: PHONE_WIDTH - 8,
      height: PHONE_HEIGHT - 8,
      rx: PHONE_RADIUS - 4,
      ry: PHONE_RADIUS - 4,
      fill: '#2d2d2d',
      selectable: false,
      evented: false,
      name: 'phoneBezel',
    });

    // Phone screen background
    const screenBg = new fabric.Rect({
      left: phoneX + BEZEL,
      top: phoneY + BEZEL,
      width: PHONE_WIDTH - BEZEL * 2,
      height: PHONE_HEIGHT - BEZEL * 2,
      rx: PHONE_RADIUS - BEZEL,
      ry: PHONE_RADIUS - BEZEL,
      fill: '#000000',
      selectable: false,
      evented: false,
      name: 'screenBg',
    });

    // Notch
    const notchWidth = PHONE_WIDTH * 0.35;
    const notch = new fabric.Rect({
      left: phoneX + (PHONE_WIDTH - notchWidth) / 2,
      top: phoneY + BEZEL - 2,
      width: notchWidth,
      height: NOTCH_HEIGHT,
      rx: 15,
      ry: 15,
      fill: '#1a1a1a',
      selectable: false,
      evented: false,
      name: 'notch',
    });

    // Camera
    const camera = new fabric.Circle({
      left: phoneX + (PHONE_WIDTH - notchWidth) / 2 + notchWidth - 28,
      top: phoneY + BEZEL + 6,
      radius: 6,
      fill: '#0a1929',
      selectable: false,
      evented: false,
      name: 'camera',
    });

    canvas.add(phoneFrame, phoneBezel, screenBg, notch, camera);
  };

  // Add text to canvas
  const addText = (canvas: fabric.Canvas, content: string, top: number) => {
    const text = new fabric.IText(content, {
      left: CANVAS_WIDTH / 2,
      top: top,
      fontSize: 36,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '700',
      fill: textColor,
      opacity: textOpacity / 100,
      textAlign: 'center',
      originX: 'center',
      originY: 'top',
      editable: true,
      selectable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    return text;
  };

  // Handle screenshot upload
  const handleScreenshotUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setScreenshot(dataUrl);

      fabric.Image.fromURL(dataUrl).then((img) => {
        const canvas = fabricRef.current!;

        // Remove previous screenshot if exists
        const existingScreenshot = canvas.getObjects().find(obj => (obj as any).name === 'screenshot');
        if (existingScreenshot) {
          canvas.remove(existingScreenshot);
        }

        // Calculate screen area inside phone
        const phoneX = (CANVAS_WIDTH - PHONE_WIDTH) / 2;
        const phoneY = 180;
        const screenX = phoneX + BEZEL;
        const screenY = phoneY + BEZEL + NOTCH_HEIGHT;
        const screenWidth = PHONE_WIDTH - BEZEL * 2;
        const screenHeight = PHONE_HEIGHT - BEZEL * 2 - NOTCH_HEIGHT;

        // Scale image to cover screen area
        const scaleX = screenWidth / img.width!;
        const scaleY = screenHeight / img.height!;
        const scale = Math.max(scaleX, scaleY);

        img.set({
          left: screenX + screenWidth / 2,
          top: screenY,
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'top',
          selectable: false,
          evented: false,
          name: 'screenshot',
        });

        // Clip to screen area with rounded corners
        img.clipPath = new fabric.Rect({
          left: screenX,
          top: screenY,
          width: screenWidth,
          height: screenHeight,
          rx: PHONE_RADIUS - BEZEL - 5,
          ry: PHONE_RADIUS - BEZEL - 5,
          absolutePositioned: true,
        });

        // Insert screenshot after screen background but before notch
        const screenBgIndex = canvas.getObjects().findIndex(obj => (obj as any).name === 'screenBg');
        canvas.insertAt(screenBgIndex + 1, img);
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
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, []);

  // Delete selected object
  const deleteSelected = useCallback(() => {
    if (!fabricRef.current || !selectedObject) return;
    fabricRef.current.remove(selectedObject);
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    setSelectedObject(null);
  }, [selectedObject]);

  // Add new text element
  const handleAddText = useCallback(() => {
    if (!fabricRef.current) return;
    addText(fabricRef.current, 'Nouveau texte', 100);
  }, [textColor, textOpacity]);

  // Update text color
  const handleTextColorChange = useCallback((color: string) => {
    setTextColor(color);
    if (selectedObject && selectedObject.type === 'i-text') {
      (selectedObject as fabric.IText).set('fill', color);
      fabricRef.current?.renderAll();
    }
  }, [selectedObject]);

  // Update text opacity
  const handleTextOpacityChange = useCallback((value: number[]) => {
    const opacity = value[0];
    setTextOpacity(opacity);
    if (selectedObject && selectedObject.type === 'i-text') {
      selectedObject.set('opacity', opacity / 100);
      fabricRef.current?.renderAll();
    }
  }, [selectedObject]);

  // Export as PNG
  const exportMockup = useCallback(() => {
    if (!fabricRef.current) return;

    // Deselect all before export
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
        <h1 className="mb-6 text-2xl font-bold flex items-center gap-2">
          <ImageIcon size={28} weight="duotone" />
          Mockup Editor
        </h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Canvas Area */}
          <Card className="p-4">
            <div
              className="mx-auto rounded-lg bg-gray-200 p-4"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: 'fit-content' }}
            >
              <canvas ref={canvasRef} className="rounded-lg shadow-xl" />
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <Button onClick={exportMockup} disabled={!isReady} className="gap-2">
                <Download size={20} weight="bold" />
                Telecharger PNG
              </Button>
            </div>
          </Card>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Background Color */}
            <Card className="p-4">
              <Label className="mb-3 flex items-center gap-2 font-medium">
                <Palette size={20} weight="duotone" />
                Couleur de fond
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={cn(
                      'h-10 w-10 rounded-lg border-2 transition-all',
                      backgroundColor === color
                        ? 'border-black ring-2 ring-black/20 scale-110'
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
                  className="h-10 w-10 cursor-pointer rounded border-0"
                />
                <span className="text-sm text-gray-500">{backgroundColor}</span>
              </div>
            </Card>

            {/* Screenshot Upload */}
            <Card className="p-4">
              <Label className="mb-3 flex items-center gap-2 font-medium">
                <ImageIcon size={20} weight="duotone" />
                Screenshot
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
                  screenshot
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                )}
              >
                {screenshot ? (
                  <div className="text-center">
                    <img
                      src={screenshot}
                      alt="Screenshot"
                      className="mx-auto mb-2 h-24 rounded object-contain"
                    />
                    <p className="text-xs text-green-600">Cliquez pour changer</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 text-gray-400" />
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
              <Label className="mb-3 flex items-center gap-2 font-medium">
                <TextT size={20} weight="duotone" />
                Texte
              </Label>

              <Button onClick={handleAddText} variant="outline" className="w-full gap-2 mb-4">
                <Plus size={18} weight="bold" />
                Ajouter du texte
              </Button>

              {isTextSelected && (
                <div className="space-y-4 border-t pt-4">
                  {/* Text Color */}
                  <div>
                    <Label className="mb-2 flex items-center gap-2 text-sm">
                      <Palette size={16} />
                      Couleur du texte
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {TEXT_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleTextColorChange(color)}
                          className={cn(
                            'h-8 w-8 rounded-md border-2 transition-all',
                            textColor === color
                              ? 'border-black scale-110'
                              : 'border-gray-300 hover:scale-105'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => handleTextColorChange(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border-0"
                      />
                    </div>
                  </div>

                  {/* Text Opacity */}
                  <div>
                    <Label className="mb-2 flex items-center gap-2 text-sm">
                      <Eye size={16} />
                      Opacite: {textOpacity}%
                    </Label>
                    <Slider
                      value={[textOpacity]}
                      onValueChange={handleTextOpacityChange}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Delete */}
                  <Button
                    onClick={deleteSelected}
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <Trash size={18} weight="bold" />
                    Supprimer le texte
                  </Button>
                </div>
              )}

              <p className="mt-3 text-xs text-gray-500">
                Double-cliquez pour editer. Glissez pour deplacer.
                {!isTextSelected && ' Selectionnez un texte pour plus d\'options.'}
              </p>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-900">Raccourcis</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li><kbd className="bg-blue-100 px-1 rounded">Suppr</kbd> Supprimer l&apos;element</li>
                <li><kbd className="bg-blue-100 px-1 rounded">Double-clic</kbd> Editer le texte</li>
                <li><kbd className="bg-blue-100 px-1 rounded">Echap</kbd> Deselectionner</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
