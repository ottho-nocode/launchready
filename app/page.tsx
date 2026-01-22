'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Group, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import Konva from 'konva';
import {
  DeviceMobile,
  Palette,
  Image as ImageIcon,
  TextT,
  Plus,
  Trash,
  Download,
  DeviceTablet,
  Star,
  Heart,
  Lightning,
  Fire,
  Sparkle,
  CheckCircle,
  ArrowRight,
  Trophy,
  Rocket,
  Crown,
  Gift,
  Bell,
  ShieldCheck,
  Lock,
  Eye,
  ThumbsUp,
  ChatCircle,
  Envelope,
  Phone,
  MapPin,
  Clock,
  Calendar,
  User,
  Users,
  Gear,
  MagnifyingGlass,
  House,
  ShoppingCart,
  CreditCard,
  Wallet,
  ChartBar,
  TrendUp,
  Smiley,
  CaretDown,
  CaretUp,
  ArrowUp,
  ArrowDown,
  Stack,
  ArrowClockwise,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';
import { renderToString } from 'react-dom/server';

// Available icons for the picker
const AVAILABLE_ICONS = [
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Lightning', icon: Lightning },
  { name: 'Fire', icon: Fire },
  { name: 'Sparkle', icon: Sparkle },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'ArrowRight', icon: ArrowRight },
  { name: 'Trophy', icon: Trophy },
  { name: 'Rocket', icon: Rocket },
  { name: 'Crown', icon: Crown },
  { name: 'Gift', icon: Gift },
  { name: 'Bell', icon: Bell },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Lock', icon: Lock },
  { name: 'Eye', icon: Eye },
  { name: 'ThumbsUp', icon: ThumbsUp },
  { name: 'ChatCircle', icon: ChatCircle },
  { name: 'Envelope', icon: Envelope },
  { name: 'Phone', icon: Phone },
  { name: 'MapPin', icon: MapPin },
  { name: 'Clock', icon: Clock },
  { name: 'Calendar', icon: Calendar },
  { name: 'User', icon: User },
  { name: 'Users', icon: Users },
  { name: 'Gear', icon: Gear },
  { name: 'MagnifyingGlass', icon: MagnifyingGlass },
  { name: 'House', icon: House },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Wallet', icon: Wallet },
  { name: 'ChartBar', icon: ChartBar },
  { name: 'TrendUp', icon: TrendUp },
  { name: 'Smiley', icon: Smiley },
];

// Export formats - App Store required image sizes
const EXPORT_FORMATS = {
  '1242x2688': { name: '1242 × 2688', width: 1242, height: 2688 },
  '2688x1242': { name: '2688 × 1242', width: 2688, height: 1242 },
  '1284x2778': { name: '1284 × 2778', width: 1284, height: 2778 },
  '2778x1284': { name: '2778 × 1284', width: 2778, height: 1284 },
};

type ExportFormat = keyof typeof EXPORT_FORMATS;

// Device configurations - phone models
const DEVICES = {
  'iphone-15-pro-max': { name: 'iPhone 15 Pro Max', width: 1290, height: 2796, scale: 0.14, notch: 'dynamic-island' },
  'iphone-15-pro': { name: 'iPhone 15 Pro', width: 1179, height: 2556, scale: 0.155, notch: 'dynamic-island' },
  'iphone-15': { name: 'iPhone 15', width: 1179, height: 2556, scale: 0.155, notch: 'dynamic-island' },
  'iphone-14': { name: 'iPhone 14', width: 1170, height: 2532, scale: 0.157, notch: 'notch' },
  'iphone-13-mini': { name: 'iPhone 13 mini', width: 1080, height: 2340, scale: 0.17, notch: 'notch' },
  'iphone-se': { name: 'iPhone SE', width: 750, height: 1334, scale: 0.28, notch: 'none' },
  'ipad-pro-12.9': { name: 'iPad Pro 12.9"', width: 2048, height: 2732, scale: 0.14, notch: 'none' },
  'ipad-pro-11': { name: 'iPad Pro 11"', width: 1668, height: 2388, scale: 0.16, notch: 'none' },
};

type DeviceType = keyof typeof DEVICES;

// Background presets - solids and gradients
const BACKGROUNDS = [
  // Solid colors
  { name: 'Blue', type: 'solid' as const, colors: ['#2563EB'] },
  { name: 'Violet', type: 'solid' as const, colors: ['#7C3AED'] },
  { name: 'Pink', type: 'solid' as const, colors: ['#DB2777'] },
  { name: 'Red', type: 'solid' as const, colors: ['#DC2626'] },
  { name: 'Orange', type: 'solid' as const, colors: ['#EA580C'] },
  { name: 'Green', type: 'solid' as const, colors: ['#16A34A'] },
  { name: 'Cyan', type: 'solid' as const, colors: ['#0891B2'] },
  { name: 'Dark', type: 'solid' as const, colors: ['#1E293B'] },
  { name: 'Light', type: 'solid' as const, colors: ['#F5F5F4'] },
  // Gradients
  { name: 'Ocean', type: 'gradient' as const, colors: ['#667eea', '#764ba2'] },
  { name: 'Sunset', type: 'gradient' as const, colors: ['#f093fb', '#f5576c'] },
  { name: 'Forest', type: 'gradient' as const, colors: ['#11998e', '#38ef7d'] },
  { name: 'Fire', type: 'gradient' as const, colors: ['#f12711', '#f5af19'] },
  { name: 'Night', type: 'gradient' as const, colors: ['#232526', '#414345'] },
  { name: 'Sky', type: 'gradient' as const, colors: ['#56CCF2', '#2F80ED'] },
  { name: 'Candy', type: 'gradient' as const, colors: ['#ff6a88', '#ff99ac'] },
  { name: 'Aurora', type: 'gradient' as const, colors: ['#00d2ff', '#3a7bd5'] },
];

const TEXT_COLORS = ['#FFFFFF', '#FEF3C7', '#000000', '#2563EB', '#DC2626', '#16A34A'];

// Google Fonts available for text
const FONTS = [
  { name: 'Inter', family: 'var(--font-inter), Inter, sans-serif' },
  { name: 'Poppins', family: 'var(--font-poppins), Poppins, sans-serif' },
  { name: 'Roboto', family: 'var(--font-roboto), Roboto, sans-serif' },
  { name: 'Montserrat', family: 'var(--font-montserrat), Montserrat, sans-serif' },
  { name: 'Open Sans', family: 'var(--font-open-sans), Open Sans, sans-serif' },
  { name: 'Playfair', family: 'var(--font-playfair), Playfair Display, serif' },
  { name: 'Lato', family: 'var(--font-lato), Lato, sans-serif' },
  { name: 'Oswald', family: 'var(--font-oswald), Oswald, sans-serif' },
  { name: 'Raleway', family: 'var(--font-raleway), Raleway, sans-serif' },
  { name: 'Ubuntu', family: 'var(--font-ubuntu), Ubuntu, sans-serif' },
];

const TEXT_ALIGNMENTS = [
  { value: 'left', label: 'Gauche' },
  { value: 'center', label: 'Centre' },
  { value: 'right', label: 'Droite' },
  { value: 'justify', label: 'Justifié' },
];

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontFamily: string;
  fontStyle: string;
  align: string;
  width: number;
  draggable: boolean;
  zIndex: number;
}

interface IconElement {
  id: string;
  iconName: string;
  x: number;
  y: number;
  size: number;
  fill: string;
  opacity: number;
  weight: IconWeight;
  draggable: boolean;
  zIndex: number;
}

// History state for undo/redo
interface HistoryState {
  textElements: TextElement[];
  iconElements: IconElement[];
}

// Collapsible card component
function CollapsibleCard({
  title,
  icon,
  children,
  defaultOpen = false
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <Label className="flex items-center gap-2 font-medium cursor-pointer">
          {icon}
          {title}
        </Label>
        {isOpen ? <CaretUp size={18} /> : <CaretDown size={18} />}
      </button>
      {isOpen && <div className="px-4 pb-4 border-t">{children}</div>}
    </Card>
  );
}

export default function MockupEditor() {
  const stageRef = useRef<Konva.Stage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // State
  const [exportFormat, setExportFormat] = useState<ExportFormat>('1242x2688');
  const [device, setDevice] = useState<DeviceType>('iphone-15-pro-max');

  // Canvas dimensions based on export format (preview scale)
  const exportConfig = EXPORT_FORMATS[exportFormat];
  const isLandscape = exportConfig.width > exportConfig.height;
  const PREVIEW_SCALE = isLandscape ? 0.3 : 0.3;
  const CANVAS_WIDTH = Math.round(exportConfig.width * PREVIEW_SCALE);
  const CANVAS_HEIGHT = Math.round(exportConfig.height * PREVIEW_SCALE);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [screenshot, setScreenshot] = useState<HTMLImageElement | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [phonePosition, setPhonePosition] = useState({ x: 0, y: 40 }); // Offset from center
  const [phoneScale, setPhoneScale] = useState(1); // Scale factor for phone
  const [isPhoneSelected, setIsPhoneSelected] = useState(false);
  const phoneTransformerRef = useRef<Konva.Transformer>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: 'text-1',
      text: 'Votre texte\npromotionnel',
      x: CANVAS_WIDTH / 2,
      y: 50,
      fontSize: 32,
      fill: '#FFFFFF',
      fontFamily: FONTS[0].family,
      fontStyle: 'bold',
      align: 'center',
      width: 350,
      draggable: true,
      zIndex: 1,
    },
  ]);
  const [nextZIndex, setNextZIndex] = useState(2);
  const [iconElements, setIconElements] = useState<IconElement[]>([]);
  const [iconImages, setIconImages] = useState<Record<string, HTMLImageElement>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'text' | 'icon' | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoingRef = useRef(false);

  // Device dimensions
  const deviceConfig = DEVICES[device];
  const phoneWidth = deviceConfig.width * deviceConfig.scale;
  const phoneHeight = deviceConfig.height * deviceConfig.scale;
  const basePhoneX = (CANVAS_WIDTH - phoneWidth) / 2;
  const basePhoneY = (CANVAS_HEIGHT - phoneHeight) / 2;
  const phoneX = basePhoneX + phonePosition.x;
  const phoneY = basePhoneY + phonePosition.y;

  // Screen dimensions (inside phone) - relative to phone position
  const bezelWidth = phoneWidth * 0.03;
  const cornerRadius = phoneWidth * 0.12;
  const screenOffsetX = bezelWidth;
  const screenOffsetY = bezelWidth;
  const screenWidth = phoneWidth - bezelWidth * 2;
  const screenHeight = phoneHeight - bezelWidth * 2;

  // Notch dimensions - relative to phone
  const notchWidth = phoneWidth * 0.35;
  const notchHeight = phoneHeight * 0.035;
  const notchOffsetX = (phoneWidth - notchWidth) / 2;
  const notchOffsetY = bezelWidth;

  // Update transformer when selection changes (text or icon)
  useEffect(() => {
    if (selectedId && selectedType && transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, selectedType]);

  // Update phone transformer when phone is selected
  useEffect(() => {
    if (isPhoneSelected && phoneTransformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne('#phone-group');
      if (node) {
        phoneTransformerRef.current.nodes([node]);
        phoneTransformerRef.current.getLayer()?.batchDraw();
      }
    } else if (phoneTransformerRef.current) {
      phoneTransformerRef.current.nodes([]);
      phoneTransformerRef.current.getLayer()?.batchDraw();
    }
  }, [isPhoneSelected]);

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

  // Save state to history
  const saveToHistory = useCallback(() => {
    if (isUndoingRef.current) return;

    const newState: HistoryState = {
      textElements: JSON.parse(JSON.stringify(textElements)),
      iconElements: JSON.parse(JSON.stringify(iconElements)),
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      // Limit history to 50 states
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [textElements, iconElements, historyIndex]);

  // Add new text element
  const addTextElement = useCallback(() => {
    saveToHistory();
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
        fontFamily: FONTS[0].family,
        fontStyle: 'bold',
        align: 'center',
        width: 300,
        draggable: true,
        zIndex: nextZIndex,
      },
    ]);
    setNextZIndex(prev => prev + 1);
    setSelectedId(newId);
    setSelectedType('text');
    setIsPhoneSelected(false);
  }, [nextZIndex, saveToHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    isUndoingRef.current = true;
    const prevState = history[historyIndex - 1];
    setTextElements(prevState.textElements);
    setIconElements(prevState.iconElements);
    setHistoryIndex(prev => prev - 1);
    setSelectedId(null);
    setSelectedType(null);

    setTimeout(() => { isUndoingRef.current = false; }, 100);
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    isUndoingRef.current = true;
    const nextState = history[historyIndex + 1];
    setTextElements(nextState.textElements);
    setIconElements(nextState.iconElements);
    setHistoryIndex(prev => prev + 1);
    setSelectedId(null);
    setSelectedType(null);

    setTimeout(() => { isUndoingRef.current = false; }, 100);
  }, [history, historyIndex]);

  // Create icon image from Phosphor icon
  const createIconImage = useCallback((iconName: string, color: string, size: number, weight: IconWeight = 'fill', opacity: number = 1): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const iconData = AVAILABLE_ICONS.find(i => i.name === iconName);
      if (!iconData) return;

      const IconComponent = iconData.icon;
      const svgString = renderToString(
        <IconComponent size={size} color={color} weight={weight} opacity={opacity} />
      );

      const img = new window.Image();
      img.onload = () => resolve(img);
      img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
    });
  }, []);

  // Add new icon element
  const addIconElement = useCallback(async (iconName: string) => {
    saveToHistory();
    const newId = `icon-${Date.now()}`;
    const color = '#FFFFFF';
    const size = 48;
    const weight: IconWeight = 'fill';
    const opacity = 1;

    const img = await createIconImage(iconName, color, size, weight, opacity);
    setIconImages(prev => ({ ...prev, [newId]: img }));

    setIconElements((prev) => [
      ...prev,
      {
        id: newId,
        iconName,
        x: CANVAS_WIDTH / 2,
        y: 150 + prev.length * 60,
        size,
        fill: color,
        opacity,
        weight,
        draggable: true,
        zIndex: nextZIndex,
      },
    ]);
    setNextZIndex(prev => prev + 1);
    setSelectedId(newId);
    setSelectedType('icon');
    setIsPhoneSelected(false);
  }, [createIconImage, nextZIndex]);

  // Move element forward (higher z-index)
  const moveForward = useCallback(() => {
    if (!selectedId || !selectedType) return;
    saveToHistory();

    if (selectedType === 'text') {
      setTextElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: el.zIndex + 1 } : el
      ));
    } else if (selectedType === 'icon') {
      setIconElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: el.zIndex + 1 } : el
      ));
    }
  }, [selectedId, selectedType, saveToHistory]);

  // Move element backward (lower z-index)
  const moveBackward = useCallback(() => {
    if (!selectedId || !selectedType) return;
    saveToHistory();

    if (selectedType === 'text') {
      setTextElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: Math.max(0, el.zIndex - 1) } : el
      ));
    } else if (selectedType === 'icon') {
      setIconElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: Math.max(0, el.zIndex - 1) } : el
      ));
    }
  }, [selectedId, selectedType, saveToHistory]);

  // Bring to front
  const bringToFront = useCallback(() => {
    if (!selectedId || !selectedType) return;
    saveToHistory();

    const maxZ = Math.max(
      ...textElements.map(el => el.zIndex),
      ...iconElements.map(el => el.zIndex),
      0
    );

    if (selectedType === 'text') {
      setTextElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: maxZ + 1 } : el
      ));
    } else if (selectedType === 'icon') {
      setIconElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: maxZ + 1 } : el
      ));
    }
    setNextZIndex(maxZ + 2);
  }, [selectedId, selectedType, textElements, iconElements, saveToHistory]);

  // Send to back
  const sendToBack = useCallback(() => {
    if (!selectedId || !selectedType) return;
    saveToHistory();

    // Decrease all other elements' z-index
    if (selectedType === 'text') {
      setTextElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: 0 } : { ...el, zIndex: el.zIndex + 1 }
      ));
      setIconElements(prev => prev.map(el => ({ ...el, zIndex: el.zIndex + 1 })));
    } else if (selectedType === 'icon') {
      setIconElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, zIndex: 0 } : { ...el, zIndex: el.zIndex + 1 }
      ));
      setTextElements(prev => prev.map(el => ({ ...el, zIndex: el.zIndex + 1 })));
    }
  }, [selectedId, selectedType, saveToHistory]);

  // Update icon element
  const updateIconElement = useCallback(async (id: string, updates: Partial<IconElement>, skipHistory = false) => {
    if (!skipHistory) saveToHistory();

    setIconElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );

    // Regenerate image if color, size, weight or opacity changed
    const element = iconElements.find(el => el.id === id);
    if (element && (updates.fill || updates.size || updates.weight || updates.opacity !== undefined)) {
      const newColor = updates.fill || element.fill;
      const newSize = updates.size || element.size;
      const newWeight = updates.weight || element.weight;
      const newOpacity = updates.opacity !== undefined ? updates.opacity : element.opacity;
      const img = await createIconImage(element.iconName, newColor, newSize, newWeight, newOpacity);
      setIconImages(prev => ({ ...prev, [id]: img }));
    }
  }, [iconElements, createIconImage, saveToHistory]);

  // Update text element
  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>, skipHistory = false) => {
    if (!skipHistory) saveToHistory();
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, [saveToHistory]);

  // Delete selected element (text or icon)
  const deleteSelected = useCallback(() => {
    if (selectedId) {
      if (selectedType === 'text') {
        setTextElements((prev) => prev.filter((el) => el.id !== selectedId));
      } else if (selectedType === 'icon') {
        setIconElements((prev) => prev.filter((el) => el.id !== selectedId));
        setIconImages((prev) => {
          const newImages = { ...prev };
          delete newImages[selectedId];
          return newImages;
        });
      }
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [selectedId, selectedType]);

  // Handle text drag end
  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    updateTextElement(id, { x: e.target.x(), y: e.target.y() });
  }, [updateTextElement]);

  // Handle stage click (deselect)
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedType(null);
      setIsPhoneSelected(false);
    }
  }, []);

  // Export PNG at exact App Store dimensions
  const exportMockup = useCallback(() => {
    if (!stageRef.current) return;

    // Deselect before export
    setSelectedId(null);
    setIsPhoneSelected(false);

    setTimeout(() => {
      // Calculate pixel ratio to get exact export dimensions
      const pixelRatio = exportConfig.width / CANVAS_WIDTH;

      const uri = stageRef.current?.toDataURL({
        pixelRatio,
        mimeType: 'image/png',
      });

      if (uri) {
        const link = document.createElement('a');
        link.download = `mockup-${exportConfig.width}x${exportConfig.height}-${Date.now()}.png`;
        link.href = uri;
        link.click();
      }
    }, 100);
  }, [exportConfig, CANVAS_WIDTH]);

  // Get selected elements
  const selectedTextElement = selectedType === 'text' ? textElements.find((el) => el.id === selectedId) : null;
  const selectedIconElement = selectedType === 'icon' ? iconElements.find((el) => el.id === selectedId) : null;

  // Combine and sort all elements by z-index for rendering
  const sortedElements = [
    ...textElements.map(el => ({ ...el, type: 'text' as const })),
    ...iconElements.map(el => ({ ...el, type: 'icon' as const })),
  ].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <DeviceMobile size={28} weight="duotone" />
          Mockup Editor
        </h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Canvas */}
          <Card className="p-4">
            {/* Toolbar - Undo/Redo and Layer controls */}
            <div className="mb-3 flex items-center justify-between">
              {/* Undo/Redo */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={undo}
                  variant="outline"
                  size="sm"
                  title="Annuler (Undo)"
                  disabled={historyIndex <= 0}
                >
                  <ArrowCounterClockwise size={16} />
                </Button>
                <Button
                  onClick={redo}
                  variant="outline"
                  size="sm"
                  title="Rétablir (Redo)"
                  disabled={historyIndex >= history.length - 1}
                >
                  <ArrowClockwise size={16} />
                </Button>
              </div>

              {/* Layer position controls and delete - shown when element is selected */}
              {selectedId && selectedType && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Stack size={16} />
                    Position :
                  </span>
                  <Button
                    onClick={sendToBack}
                    variant="outline"
                    size="sm"
                    title="Envoyer à l'arrière"
                  >
                    <ArrowDown size={14} />
                    <ArrowDown size={14} className="-ml-2" />
                  </Button>
                  <Button
                    onClick={moveBackward}
                    variant="outline"
                    size="sm"
                    title="Reculer"
                  >
                    <ArrowDown size={16} />
                  </Button>
                  <Button
                    onClick={moveForward}
                    variant="outline"
                    size="sm"
                    title="Avancer"
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    onClick={bringToFront}
                    variant="outline"
                    size="sm"
                    title="Mettre au premier plan"
                  >
                    <ArrowUp size={14} />
                    <ArrowUp size={14} className="-ml-2" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button
                    onClick={deleteSelected}
                    variant="destructive"
                    size="sm"
                    title="Supprimer"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              )}
            </div>

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
                    fill={background.type === 'solid' ? background.colors[0] : undefined}
                    fillLinearGradientStartPoint={background.type === 'gradient' ? { x: 0, y: 0 } : undefined}
                    fillLinearGradientEndPoint={background.type === 'gradient' ? { x: 0, y: CANVAS_HEIGHT } : undefined}
                    fillLinearGradientColorStops={background.type === 'gradient' ? [0, background.colors[0], 1, background.colors[1]] : undefined}
                  />
                </Layer>

                {/* Phone Layer */}
                <Layer>
                  <Group
                    id="phone-group"
                    x={phoneX}
                    y={phoneY}
                    scaleX={phoneScale}
                    scaleY={phoneScale}
                    draggable
                    onClick={() => {
                      setIsPhoneSelected(true);
                      setSelectedId(null);
                    }}
                    onTap={() => {
                      setIsPhoneSelected(true);
                      setSelectedId(null);
                    }}
                    onDragEnd={(e) => {
                      const newX = e.target.x() - basePhoneX;
                      const newY = e.target.y() - basePhoneY;
                      setPhonePosition({ x: newX, y: newY });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const newScale = node.scaleX();
                      setPhoneScale(newScale);
                      setPhonePosition({
                        x: node.x() - basePhoneX,
                        y: node.y() - basePhoneY,
                      });
                    }}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage()?.container();
                      if (container) container.style.cursor = 'move';
                    }}
                    onMouseLeave={(e) => {
                      const container = e.target.getStage()?.container();
                      if (container) container.style.cursor = 'default';
                    }}
                  >
                    {/* Phone outer frame */}
                    <Rect
                      x={0}
                      y={0}
                      width={phoneWidth}
                      height={phoneHeight}
                      fill="#1a1a1a"
                      cornerRadius={cornerRadius}
                    />

                    {/* Phone bezel */}
                    <Rect
                      x={3}
                      y={3}
                      width={phoneWidth - 6}
                      height={phoneHeight - 6}
                      fill="#2d2d2d"
                      cornerRadius={cornerRadius - 3}
                    />

                    {/* Screen with clipping */}
                    <Group
                      clipFunc={(ctx) => {
                        ctx.beginPath();
                        const r = cornerRadius - bezelWidth;
                        const sx = screenOffsetX;
                        const sy = screenOffsetY;
                        ctx.moveTo(sx + r, sy);
                        ctx.lineTo(sx + screenWidth - r, sy);
                        ctx.quadraticCurveTo(sx + screenWidth, sy, sx + screenWidth, sy + r);
                        ctx.lineTo(sx + screenWidth, sy + screenHeight - r);
                        ctx.quadraticCurveTo(sx + screenWidth, sy + screenHeight, sx + screenWidth - r, sy + screenHeight);
                        ctx.lineTo(sx + r, sy + screenHeight);
                        ctx.quadraticCurveTo(sx, sy + screenHeight, sx, sy + screenHeight - r);
                        ctx.lineTo(sx, sy + r);
                        ctx.quadraticCurveTo(sx, sy, sx + r, sy);
                        ctx.closePath();
                      }}
                    >
                      {/* Screen background */}
                      <Rect
                        x={screenOffsetX}
                        y={screenOffsetY}
                        width={screenWidth}
                        height={screenHeight}
                        fill="#000"
                      />

                      {/* Screenshot */}
                      {screenshot && (
                        <KonvaImage
                          image={screenshot}
                          x={screenOffsetX}
                          y={screenOffsetY}
                          width={screenWidth}
                          height={screenHeight}
                          crop={{
                            x: 0,
                            y: 0,
                            width: screenshot.width,
                            height: Math.min(screenshot.height, screenshot.width * (screenHeight / screenWidth)),
                          }}
                        />
                      )}
                    </Group>

                    {/* Notch / Dynamic Island */}
                    {deviceConfig.notch === 'notch' && (
                      <Rect
                        x={notchOffsetX}
                        y={notchOffsetY}
                        width={notchWidth}
                        height={notchHeight}
                        fill="#1a1a1a"
                        cornerRadius={[0, 0, notchHeight / 2, notchHeight / 2]}
                      />
                    )}
                    {deviceConfig.notch === 'dynamic-island' && (
                      <Rect
                        x={(phoneWidth - phoneWidth * 0.28) / 2}
                        y={screenOffsetY + 10}
                        width={phoneWidth * 0.28}
                        height={notchHeight * 0.7}
                        fill="#1a1a1a"
                        cornerRadius={notchHeight * 0.35}
                      />
                    )}
                  </Group>
                  <Transformer
                    ref={phoneTransformerRef}
                    keepRatio={true}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 50 || newBox.height < 50) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                </Layer>

                {/* Text & Icons Layer */}
                <Layer>
                  {/* Render text elements */}
                  {textElements.map((textEl) => (
                    <Text
                      key={`${textEl.id}-fs${textEl.fontSize}`}
                      id={textEl.id}
                      text={textEl.text}
                      x={textEl.x}
                      y={textEl.y}
                      fontSize={textEl.fontSize}
                      fill={textEl.fill}
                      fontStyle={textEl.fontStyle}
                      fontFamily="Arial"
                      align={textEl.align}
                      width={textEl.width}
                      offsetX={textEl.width / 2}
                      draggable={textEl.draggable}
                      onClick={() => {
                        setSelectedId(textEl.id);
                        setSelectedType('text');
                        setIsPhoneSelected(false);
                      }}
                      onTap={() => {
                        setSelectedId(textEl.id);
                        setSelectedType('text');
                        setIsPhoneSelected(false);
                      }}
                      onDragEnd={(e) => handleDragEnd(e, textEl.id)}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        updateTextElement(textEl.id, {
                          x: node.x(),
                          y: node.y(),
                          width: Math.round(Math.max(50, node.width() * node.scaleX())),
                          fontSize: Math.round(Math.max(12, textEl.fontSize * node.scaleY())),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  ))}
                  {/* Render icon elements */}
                  {iconElements.map((iconEl) => {
                    if (!iconImages[iconEl.id]) return null;
                    return (
                      <KonvaImage
                        key={iconEl.id}
                        id={iconEl.id}
                        image={iconImages[iconEl.id]}
                        x={iconEl.x}
                        y={iconEl.y}
                        width={iconEl.size}
                        height={iconEl.size}
                        offsetX={iconEl.size / 2}
                        offsetY={iconEl.size / 2}
                        draggable={iconEl.draggable}
                        onClick={() => {
                          setSelectedId(iconEl.id);
                          setSelectedType('icon');
                          setIsPhoneSelected(false);
                        }}
                        onTap={() => {
                          setSelectedId(iconEl.id);
                          setSelectedType('icon');
                          setIsPhoneSelected(false);
                        }}
                        onDragEnd={(e) => {
                          setIconElements(prev =>
                            prev.map(icon =>
                              icon.id === iconEl.id
                                ? { ...icon, x: e.target.x(), y: e.target.y() }
                                : icon
                            )
                          );
                        }}
                        onTransformEnd={(e) => {
                          const node = e.target;
                          const newSize = Math.max(16, iconEl.size * node.scaleX());
                          updateIconElement(iconEl.id, {
                            x: node.x(),
                            y: node.y(),
                            size: newSize,
                          });
                          node.scaleX(1);
                          node.scaleY(1);
                        }}
                      />
                    );
                  })}
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 20 || newBox.height < 20) {
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
                <Download size={20} className="mr-2" />
                Télécharger PNG
              </Button>
            </div>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            {/* Export Format Selection */}
            <CollapsibleCard
              title="Format d'export"
              icon={<Download size={18} weight="duotone" />}
              defaultOpen={true}
            >
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries(EXPORT_FORMATS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setExportFormat(key as ExportFormat)}
                    className={cn(
                      'rounded-lg border-2 px-3 py-2 text-center text-sm font-medium transition-colors',
                      exportFormat === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
            </CollapsibleCard>

            {/* Device Selection */}
            <CollapsibleCard
              title="Device"
              icon={<DeviceMobile size={18} weight="duotone" />}
            >
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto mt-3">
                {Object.entries(DEVICES).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setDevice(key as DeviceType)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm transition-colors',
                      device === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {key.includes('ipad') ? (
                      <DeviceTablet size={16} weight="duotone" />
                    ) : (
                      <DeviceMobile size={16} weight="duotone" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{config.name}</div>
                      <div className="text-xs text-gray-500">
                        {config.width}×{config.height}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Phone position controls */}
              <div className="mt-4 pt-4 border-t space-y-3">
                <Label className="text-sm font-medium">Position du téléphone</Label>

                <div>
                  <Label className="mb-1 block text-xs text-gray-500">
                    Horizontal: {phonePosition.x}px
                  </Label>
                  <Slider
                    value={[phonePosition.x]}
                    onValueChange={(v) => setPhonePosition(prev => ({ ...prev, x: v[0] }))}
                    min={-150}
                    max={150}
                    step={5}
                  />
                </div>

                <div>
                  <Label className="mb-1 block text-xs text-gray-500">
                    Vertical: {phonePosition.y}px
                  </Label>
                  <Slider
                    value={[phonePosition.y]}
                    onValueChange={(v) => setPhonePosition(prev => ({ ...prev, y: v[0] }))}
                    min={-100}
                    max={200}
                    step={5}
                  />
                </div>

                <div>
                  <Label className="mb-1 block text-xs text-gray-500">
                    Échelle: {Math.round(phoneScale * 100)}%
                  </Label>
                  <Slider
                    value={[phoneScale * 100]}
                    onValueChange={(v) => setPhoneScale(v[0] / 100)}
                    min={50}
                    max={150}
                    step={5}
                  />
                </div>

                <Button
                  onClick={() => {
                    setPhonePosition({ x: 0, y: 40 });
                    setPhoneScale(1);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Réinitialiser position
                </Button>
              </div>
            </CollapsibleCard>

            {/* Background */}
            <CollapsibleCard
              title="Fond"
              icon={<Palette size={18} weight="duotone" />}
            >
              <div className="mt-3">
                <div className="mb-2 text-xs text-gray-500">Couleurs unies</div>
                <div className="grid grid-cols-5 gap-2">
                  {BACKGROUNDS.filter(bg => bg.type === 'solid').map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => setBackground(bg)}
                      className={cn(
                        'h-10 w-10 rounded-lg border-2 transition-transform',
                        background.name === bg.name
                          ? 'border-black scale-110 ring-2 ring-black/20'
                          : 'border-gray-300 hover:scale-105'
                      )}
                      style={{ backgroundColor: bg.colors[0] }}
                      title={bg.name}
                    />
                  ))}
                </div>
                <div className="mt-3 mb-2 text-xs text-gray-500">Dégradés</div>
                <div className="grid grid-cols-4 gap-2">
                  {BACKGROUNDS.filter(bg => bg.type === 'gradient').map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => setBackground(bg)}
                      className={cn(
                        'h-10 w-full rounded-lg border-2 transition-transform',
                        background.name === bg.name
                          ? 'border-black scale-105 ring-2 ring-black/20'
                          : 'border-gray-300 hover:scale-105'
                      )}
                      style={{
                        background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})`
                      }}
                      title={bg.name}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="color"
                    value={background.colors[0]}
                    onChange={(e) => setBackground({ name: 'Custom', type: 'solid', colors: [e.target.value] })}
                    className="h-10 w-10 cursor-pointer rounded"
                  />
                  <span className="text-sm text-gray-500">{background.colors[0]}</span>
                </div>
              </div>
            </CollapsibleCard>

            {/* Screenshot */}
            <CollapsibleCard
              title="Screenshot"
              icon={<ImageIcon size={18} weight="duotone" />}
            >
              <div className="mt-3">
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
              </div>
            </CollapsibleCard>

            {/* Text Controls */}
            <CollapsibleCard
              title="Texte"
              icon={<TextT size={18} weight="duotone" />}
            >
              <div className="mt-3">
                <Button onClick={addTextElement} variant="outline" className="mb-3 w-full">
                  <Plus size={16} className="mr-2" />
                  Ajouter du texte
                </Button>

                {selectedTextElement && (
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
                      <Label className="mb-2 block text-sm">Alignement</Label>
                      <div className="grid grid-cols-4 gap-1">
                        {TEXT_ALIGNMENTS.map((alignment) => (
                          <button
                            key={alignment.value}
                            onClick={() => updateTextElement(selectedId!, { align: alignment.value })}
                            className={cn(
                              'rounded border px-2 py-1.5 text-xs transition-colors',
                              selectedTextElement.align === alignment.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {alignment.label}
                          </button>
                        ))}
                      </div>
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
                              selectedTextElement.fill === color
                                ? 'border-black scale-110'
                                : 'border-gray-300'
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <input
                          type="color"
                          value={selectedTextElement.fill}
                          onChange={(e) =>
                            updateTextElement(selectedId!, { fill: e.target.value })
                          }
                          className="h-8 w-8 cursor-pointer rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm">
                        Taille: {selectedTextElement.fontSize}px
                      </Label>
                      <Slider
                        value={[selectedTextElement.fontSize]}
                        onValueChange={(v) => {
                          setTextElements(prev =>
                            prev.map(el => el.id === selectedId ? { ...el, fontSize: v[0] } : el)
                          );
                        }}
                        min={12}
                        max={80}
                        step={1}
                      />
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-500">
                  Cliquez sur un texte pour le sélectionner • Glissez pour déplacer
                </p>
              </div>
            </CollapsibleCard>

            {/* Icons */}
            <CollapsibleCard
              title="Icônes"
              icon={<Star size={18} weight="duotone" />}
            >
              <div className="mt-3">
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto mb-3">
                  {AVAILABLE_ICONS.map((iconData) => {
                    const IconComp = iconData.icon;
                    return (
                      <button
                        key={iconData.name}
                        onClick={() => addIconElement(iconData.name)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        title={iconData.name}
                      >
                        <IconComp size={20} weight="fill" />
                      </button>
                    );
                  })}
                </div>

                {selectedIconElement && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label className="mb-2 block text-sm">Couleur</Label>
                      <div className="flex flex-wrap gap-2">
                        {TEXT_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => updateIconElement(selectedId!, { fill: color })}
                            className={cn(
                              'h-8 w-8 rounded border-2',
                              selectedIconElement.fill === color
                                ? 'border-black scale-110'
                                : 'border-gray-300'
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <input
                          type="color"
                          value={selectedIconElement.fill}
                          onChange={(e) =>
                            updateIconElement(selectedId!, { fill: e.target.value })
                          }
                          className="h-8 w-8 cursor-pointer rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm">
                        Taille: {Math.round(selectedIconElement.size)}px
                      </Label>
                      <Slider
                        value={[selectedIconElement.size]}
                        onValueChange={(v) =>
                          updateIconElement(selectedId!, { size: Math.round(v[0]) })
                        }
                        min={16}
                        max={120}
                        step={4}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm">
                        Opacité: {Math.round((selectedIconElement.opacity ?? 1) * 100)}%
                      </Label>
                      <Slider
                        value={[(selectedIconElement.opacity ?? 1) * 100]}
                        onValueChange={(v) =>
                          updateIconElement(selectedId!, { opacity: v[0] / 100 })
                        }
                        min={10}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm">Style</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['fill', 'bold', 'duotone'] as const).map((w) => (
                          <button
                            key={w}
                            onClick={() => updateIconElement(selectedId!, { weight: w })}
                            className={cn(
                              'rounded-lg border-2 px-2 py-1.5 text-xs font-medium transition-colors capitalize',
                              selectedIconElement.weight === w
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-500">
                  Cliquez sur une icône pour l'ajouter au canvas
                </p>
              </div>
            </CollapsibleCard>
          </div>
        </div>
      </div>
    </div>
  );
}
