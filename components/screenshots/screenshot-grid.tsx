'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppStore } from '@/store/app-store';
import { SortableScreenshot } from './sortable-screenshot';

export function ScreenshotGrid() {
  const { screenshots, removeScreenshot, updateScreenshotDevice, reorderScreenshots } =
    useAppStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (screenshots.length === 0) {
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = screenshots.findIndex((s) => s.id === active.id);
      const newIndex = screenshots.findIndex((s) => s.id === over.id);
      reorderScreenshots(oldIndex, newIndex);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={screenshots.map((s) => s.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {screenshots.map((screenshot) => (
            <SortableScreenshot
              key={screenshot.id}
              screenshot={screenshot}
              onRemove={() => removeScreenshot(screenshot.id)}
              onDeviceChange={(deviceType) =>
                updateScreenshotDevice(screenshot.id, deviceType)
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
