'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEVICE_OPTIONS } from '@/lib/screenshot-utils';
import type { DeviceType, Screenshot } from '@/types/app';

interface ScreenshotThumbnailProps {
  screenshot: Screenshot;
  onRemove: () => void;
  onDeviceChange?: (deviceType: DeviceType) => void;
}

const DEVICE_LABELS: Record<string, string> = {
  'iphone-6.7': 'iPhone 6.7"',
  'iphone-6.5': 'iPhone 6.5"',
  'iphone-5.5': 'iPhone 5.5"',
  'ipad-12.9': 'iPad 12.9"',
  unknown: 'Unknown',
};

export function ScreenshotThumbnail({
  screenshot,
  onRemove,
  onDeviceChange,
}: ScreenshotThumbnailProps) {
  const isUnknown = screenshot.deviceType === 'unknown';

  return (
    <Card className="group relative overflow-hidden">
      <div className="relative aspect-[9/19.5] w-full">
        <Image
          src={screenshot.preview}
          alt={`Screenshot ${screenshot.id}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="destructive" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        {isUnknown && onDeviceChange ? (
          <Select
            value={screenshot.deviceType}
            onValueChange={(value) => onDeviceChange(value as DeviceType)}
          >
            <SelectTrigger className="h-7 w-full border-white/30 bg-black/50 text-xs text-white">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-xs font-medium text-white">
            {DEVICE_LABELS[screenshot.deviceType] || 'Unknown'}
          </p>
        )}
        <p className="mt-1 text-xs text-white/70">
          {screenshot.width} × {screenshot.height}
        </p>
      </div>
    </Card>
  );
}
