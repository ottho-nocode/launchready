'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { DeviceColor } from '@/types/app';

const DEVICE_COLORS: { id: DeviceColor; name: string; color: string }[] = [
  { id: 'black', name: 'Black', color: '#1a1a1a' },
  { id: 'white', name: 'White', color: '#f5f5f5' },
  { id: 'gold', name: 'Gold', color: '#d4af37' },
];

const BACKGROUND_COLORS = [
  // Pastels (App Store style - Todoist-like)
  '#FEF3C7', // Cream/Amber pastel
  '#FECACA', // Rose pastel
  '#FED7AA', // Peach pastel
  '#D1FAE5', // Mint pastel
  '#CFFAFE', // Cyan pastel
  '#DBEAFE', // Blue pastel
  '#E9D5FF', // Purple pastel
  '#FCE7F3', // Pink pastel
  // Vivid colors
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#22c55e', // Green
  '#0ea5e9', // Sky
  '#f97316', // Orange
  '#1e293b', // Slate
  '#ffffff', // White
];

export function ColorPicker() {
  const { mockupOptions, setDeviceColor, setBackgroundColor } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Device Color */}
      <div className="space-y-3">
        <Label>Device Color</Label>
        <div className="flex gap-3">
          {DEVICE_COLORS.map((dc) => (
            <button
              key={dc.id}
              onClick={() => setDeviceColor(dc.id)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                mockupOptions.deviceColor === dc.id
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
              title={dc.name}
            >
              <span
                className="h-6 w-6 rounded-full border shadow-sm"
                style={{ backgroundColor: dc.color }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-3">
        <Label>Background Color</Label>
        <div className="grid grid-cols-6 gap-2">
          {BACKGROUND_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setBackgroundColor(color)}
              className={cn(
                'h-8 w-8 rounded-lg border-2 transition-all',
                mockupOptions.backgroundColor === color
                  ? 'border-primary ring-2 ring-primary/30 scale-110'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Custom color input */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={mockupOptions.backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
          />
          <span className="text-sm text-muted-foreground">
            Custom: {mockupOptions.backgroundColor}
          </span>
        </div>
      </div>
    </div>
  );
}
