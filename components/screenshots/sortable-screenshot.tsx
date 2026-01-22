'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScreenshotThumbnail } from './screenshot-thumbnail';
import type { DeviceType, Screenshot } from '@/types/app';

interface SortableScreenshotProps {
  screenshot: Screenshot;
  onRemove: () => void;
  onDeviceChange?: (deviceType: DeviceType) => void;
}

export function SortableScreenshot({
  screenshot,
  onRemove,
  onDeviceChange,
}: SortableScreenshotProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screenshot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ScreenshotThumbnail
        screenshot={screenshot}
        onRemove={onRemove}
        onDeviceChange={onDeviceChange}
      />
    </div>
  );
}
