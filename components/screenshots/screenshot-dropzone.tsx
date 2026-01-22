'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { processFiles } from '@/lib/screenshot-utils';
import { cn } from '@/lib/utils';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

export function ScreenshotDropzone() {
  const { screenshots, addScreenshots } = useAppStore();

  const remainingSlots = MAX_FILES - screenshots.length;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Limit to remaining slots
      const filesToProcess = acceptedFiles.slice(0, remainingSlots);

      try {
        const newScreenshots = await processFiles(filesToProcess);
        addScreenshots(newScreenshots);
      } catch (error) {
        console.error('Error processing files:', error);
      }
    },
    [addScreenshots, remainingSlots]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: remainingSlots,
    disabled: remainingSlots <= 0,
  });

  const isDisabled = remainingSlots <= 0;

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 transition-colors',
        isDragActive && !isDragReject && 'border-primary bg-primary/5',
        isDragReject && 'border-destructive bg-destructive/5',
        isDisabled && 'cursor-not-allowed opacity-50',
        !isDragActive && !isDisabled && 'hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <input {...getInputProps()} />

      <div className="text-center">
        <div className="mb-4 text-4xl">
          {isDragReject ? '❌' : isDragActive ? '📥' : '📷'}
        </div>

        {isDisabled ? (
          <>
            <p className="text-lg font-medium">Maximum reached</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ve added {MAX_FILES} screenshots (maximum)
            </p>
          </>
        ) : isDragReject ? (
          <>
            <p className="text-lg font-medium text-destructive">Invalid file</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Only PNG and JPEG images under 10MB are accepted
            </p>
          </>
        ) : isDragActive ? (
          <>
            <p className="text-lg font-medium text-primary">Drop your screenshots here</p>
            <p className="mt-1 text-sm text-muted-foreground">Release to upload</p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">Drag & drop your screenshots</p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to select files
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              PNG or JPEG, max 10MB each • {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''}{' '}
              remaining
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
