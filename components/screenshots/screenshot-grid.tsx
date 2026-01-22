'use client';

import { useAppStore } from '@/store/app-store';
import { ScreenshotThumbnail } from './screenshot-thumbnail';

export function ScreenshotGrid() {
  const { screenshots, removeScreenshot } = useAppStore();

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {screenshots.map((screenshot) => (
        <ScreenshotThumbnail
          key={screenshot.id}
          screenshot={screenshot}
          onRemove={() => removeScreenshot(screenshot.id)}
        />
      ))}
    </div>
  );
}
