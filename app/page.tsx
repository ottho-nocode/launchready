'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Group, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import Konva from 'konva';

// Device configurations
const DEVICES = {
  'iphone-6.5': { name: 'iPhone 6.5"', width: 1242, height: 2688, scale: 0.15 },
  'iphone-6.1': { name: 'iPhone 6.1"', width: 1284, height: 2778, scale: 0.145 },
  'iphone-5.5': { name: 'iPhone 5.5"', width: 1242, height: 2208, scale: 0.17 },
};

type DeviceType = keyof typeof DEVICES;

// Background presets
const BACKGROUNDS = [
  { name: 'Blue', type: 'solid', color: '#2563EB' },
  { name: 'Violet', type: 'solid', color: '#7C3AED' },
  { name: 'Pink', type: 'solid', color: '#DB2777' },
  { name: 'Red', type: 'solid', color: '#DC2626' },
  { name: 'Orange', type: 'solid', color: '#EA580C' },
  { name: 'Green', type: 'solid', color: '#16A34A' },
  { name: 'Cyan', type: 'solid', color: '#0891B2' },
  { name: 'Dark', type: 'solid', color: '#1E293B' },
  { name: 'Light', type: 'solid', color: '#F5F5F4' },
];

const TEXT_COLORS = ['#FFFFFF', '#FEF3C7', '#000000', '#2563EB', '#DC2626', '#16A34A'];

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontStyle: string;
  align: string;
  width: number;
  draggable: boolean;
}

export default function MockupEditor() {
  const stageRef = useRef<Konva.Stage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // Canvas dimensions
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 800;
  const EXPORT_MULTIPLIER = 3.1;

  // State
  const [device, setDevice] = useState<DeviceType>('iphone-6.5');
  const [backgroundColor, setBackgroundColor] = useState('#2563EB');
  const [screenshot, setScreenshot] = useState<HTMLImageElement | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: 'text-1',
      text: 'Votre texte\npromotionnel',
      x: CANVAS_WIDTH / 2,
      y: 50,
      fontSize: 32,
      fill: '#FFFFFF',
      fontStyle: 'bold',
      align: 'center',
      width: 350,
      draggable: true,
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Device dimensions
  const deviceConfig = DEVICES[device];
  const phoneWidth = deviceConfig.width * deviceConfig.scale;
  const phoneHeight = deviceConfig.height * deviceConfig.scale;
  const phoneX = (CANVAS_WIDTH - phoneWidth) / 2;
  const phoneY = (CANVAS_HEIGHT - phoneHeight) / 2 + 40;

  // Screen dimensions (inside phone)
  const bezelWidth = phoneWidth * 0.03;
  const cornerRadius = phoneWidth * 0.12;
  const screenX = phoneX + bezelWidth;
  const screenY = phoneY + bezelWidth;
  const screenWidth = phoneWidth - bezelWidth * 2;
  const screenHeight = phoneHeight - bezelWidth * 2;

  // Notch dimensions
  const notchWidth = phoneWidth * 0.35;
  const notchHeight = phoneHeight * 0.035;
  const notchX = phoneX + (phoneWidth - notchWidth) / 2;
  const notchY = screenY;

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  // Update editing text when selection changes
  useEffect(() => {
    if (selectedId) {
      const element = textElements.find((el) => el.id === selectedId);
      if (element) {
        setEditingText(element.text);
      }
    }
  }, [selectedId, textElements]);

  // Handle screenshot upload
  const handleScreenshotUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setScreenshotPreview(dataUrl);

      const img = new window.Image();
      img.onload = () => setScreenshot(img);
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

  // Add new text element
  const addTextElement = useCallback(() => {
    const newId = `text-${Date.now()}`;
    setTextElements((prev) => [
      ...prev,
      {
        id: newId,
        text: 'Nouveau texte',
        x: CANVAS_WIDTH / 2,
        y: 120 + prev.length * 50,
        fontSize: 24,
        fill: '#FFFFFF',
        fontStyle: 'bold',
        align: 'center',
        width: 300,
        draggable: true,
      },
    ]);
    setSelectedId(newId);
  }, []);

  // Update text element
  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  // Delete selected text
  const deleteSelected = useCallback(() => {
    if (selectedId) {
      setTextElements((prev) => prev.filter((el) => el.id !== selectedId));
      setSelectedId(null);
    }
  }, [selectedId]);

  // Handle text drag end
  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    updateTextElement(id, { x: e.target.x(), y: e.target.y() });
  }, [updateTextElement]);

  // Handle stage click (deselect)
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  }, []);

  // Export PNG
  const exportMockup = useCallback(() => {
    if (!stageRef.current) return;

    // Deselect before export
    setSelectedId(null);

    setTimeout(() => {
      const uri = stageRef.current?.toDataURL({
        pixelRatio: EXPORT_MULTIPLIER,
        mimeType: 'image/png',
      });

      if (uri) {
        const link = document.createElement('a');
        link.download = `mockup-${Date.now()}.png`;
        link.href = uri;
        link.click();
      }
    }, 100);
  }, []);

  // Get selected text element
  const selectedElement = textElements.find((el) => el.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">📱 Mockup Editor</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Canvas */}
          <Card className="p-4">
            <div
              className="mx-auto rounded-lg bg-gray-200 p-3"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: 'fit-content' }}
            >
              <Stage
                ref={stageRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleStageClick}
                style={{ borderRadius: '8px', overflow: 'hidden' }}
              >
                {/* Background Layer */}
                <Layer>
                  <Rect
                    x={0}
                    y={0}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    fill={backgroundColor}
                  />
                </Layer>

                {/* Phone Layer */}
                <Layer>
                  {/* Phone outer frame */}
                  <Rect
                    x={phoneX}
                    y={phoneY}
                    width={phoneWidth}
                    height={phoneHeight}
                    fill="#1a1a1a"
                    cornerRadius={cornerRadius}
                  />

                  {/* Phone bezel */}
                  <Rect
                    x={phoneX + 3}
                    y={phoneY + 3}
                    width={phoneWidth - 6}
                    height={phoneHeight - 6}
                    fill="#2d2d2d"
                    cornerRadius={cornerRadius - 3}
                  />

                  {/* Screen */}
                  <Group
                    clipFunc={(ctx) => {
                      ctx.beginPath();
                      const r = cornerRadius - bezelWidth;
                      ctx.moveTo(screenX + r, screenY);
                      ctx.lineTo(screenX + screenWidth - r, screenY);
                      ctx.quadraticCurveTo(screenX + screenWidth, screenY, screenX + screenWidth, screenY + r);
                      ctx.lineTo(screenX + screenWidth, screenY + screenHeight - r);
                      ctx.quadraticCurveTo(screenX + screenWidth, screenY + screenHeight, screenX + screenWidth - r, screenY + screenHeight);
                      ctx.lineTo(screenX + r, screenY + screenHeight);
                      ctx.quadraticCurveTo(screenX, screenY + screenHeight, screenX, screenY + screenHeight - r);
                      ctx.lineTo(screenX, screenY + r);
                      ctx.quadraticCurveTo(screenX, screenY, screenX + r, screenY);
                      ctx.closePath();
                    }}
                  >
                    {/* Screen background */}
                    <Rect
                      x={screenX}
                      y={screenY}
                      width={screenWidth}
                      height={screenHeight}
                      fill="#000"
                    />

                    {/* Screenshot */}
                    {screenshot && (
                      <KonvaImage
                        image={screenshot}
                        x={screenX}
                        y={screenY}
                        width={screenWidth}
                        height={screenHeight}
                        // Cover fit
                        crop={{
                          x: 0,
                          y: 0,
                          width: screenshot.width,
                          height: Math.min(screenshot.height, screenshot.width * (screenHeight / screenWidth)),
                        }}
                      />
                    )}
                  </Group>

                  {/* Notch */}
                  <Rect
                    x={notchX}
                    y={notchY}
                    width={notchWidth}
                    height={notchHeight}
                    fill="#1a1a1a"
                    cornerRadius={[0, 0, notchHeight / 2, notchHeight / 2]}
                  />
                </Layer>

                {/* Text Layer */}
                <Layer>
                  {textElements.map((el) => (
                    <Text
                      key={el.id}
                      id={el.id}
                      text={el.text}
                      x={el.x}
                      y={el.y}
                      fontSize={el.fontSize}
                      fill={el.fill}
                      fontStyle={el.fontStyle}
                      fontFamily="Inter, system-ui, sans-serif"
                      align={el.align}
                      width={el.width}
                      offsetX={el.width / 2}
                      draggable={el.draggable}
                      onClick={() => setSelectedId(el.id)}
                      onTap={() => setSelectedId(el.id)}
                      onDragEnd={(e) => handleDragEnd(e, el.id)}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        updateTextElement(el.id, {
                          x: node.x(),
                          y: node.y(),
                          width: Math.max(50, node.width() * node.scaleX()),
                          fontSize: Math.max(12, el.fontSize * node.scaleY()),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  ))}
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 50 || newBox.height < 20) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                </Layer>
              </Stage>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <Button onClick={exportMockup} size="lg">
                ⬇️ Télécharger PNG
              </Button>
            </div>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            {/* Device Selection */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">📱 Device</Label>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(DEVICES).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setDevice(key as DeviceType)}
                    className={cn(
                      'rounded-lg border-2 px-3 py-2 text-left text-sm transition-colors',
                      device === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {config.name}
                    <span className="ml-2 text-xs text-gray-500">
                      {config.width}×{config.height}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Background */}
            <Card className="p-4">
              <Label className="mb-3 block font-medium">🎨 Fond</Label>
              <div className="grid grid-cols-5 gap-2">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.color}
                    onClick={() => setBackgroundColor(bg.color)}
                    className={cn(
                      'h-10 w-10 rounded-lg border-2 transition-transform',
                      backgroundColor === bg.color
                        ? 'border-black scale-110 ring-2 ring-black/20'
                        : 'border-gray-300 hover:scale-105'
                    )}
                    style={{ backgroundColor: bg.color }}
                    title={bg.name}
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
                  screenshotPreview
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400'
                )}
              >
                {screenshotPreview ? (
                  <div className="text-center">
                    <img
                      src={screenshotPreview}
                      alt=""
                      className="mx-auto mb-2 h-16 rounded object-contain"
                    />
                    <p className="text-xs text-green-600">Cliquez pour changer</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Glissez ou cliquez</p>
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
              <Label className="mb-3 block font-medium">✏️ Texte</Label>
              <Button onClick={addTextElement} variant="outline" className="mb-3 w-full">
                + Ajouter du texte
              </Button>

              {selectedElement && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label className="mb-2 block text-sm">Contenu</Label>
                    <textarea
                      value={editingText}
                      onChange={(e) => {
                        setEditingText(e.target.value);
                        updateTextElement(selectedId!, { text: e.target.value });
                      }}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm">Couleur</Label>
                    <div className="flex flex-wrap gap-2">
                      {TEXT_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateTextElement(selectedId!, { fill: color })}
                          className={cn(
                            'h-8 w-8 rounded border-2',
                            selectedElement.fill === color
                              ? 'border-black scale-110'
                              : 'border-gray-300'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={selectedElement.fill}
                        onChange={(e) =>
                          updateTextElement(selectedId!, { fill: e.target.value })
                        }
                        className="h-8 w-8 cursor-pointer rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm">
                      Taille: {selectedElement.fontSize}px
                    </Label>
                    <Slider
                      value={[selectedElement.fontSize]}
                      onValueChange={(v) =>
                        updateTextElement(selectedId!, { fontSize: v[0] })
                      }
                      min={12}
                      max={60}
                      step={1}
                    />
                  </div>

                  <Button
                    onClick={deleteSelected}
                    variant="destructive"
                    className="w-full"
                  >
                    🗑️ Supprimer
                  </Button>
                </div>
              )}

              <p className="mt-3 text-xs text-gray-500">
                Cliquez sur un texte pour le sélectionner • Glissez pour déplacer
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
