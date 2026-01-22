'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';

export function MockupGenerator() {
  const {
    screenshots,
    mockupOptions,
    isGeneratingMockups,
    setIsGeneratingMockups,
    updateScreenshotMockup,
  } = useAppStore();
  const [generatedCount, setGeneratedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generateMockups = useCallback(async () => {
    if (screenshots.length === 0) return;

    setIsGeneratingMockups(true);
    setGeneratedCount(0);
    setError(null);

    let failedCount = 0;

    for (let i = 0; i < screenshots.length; i++) {
      const screenshot = screenshots[i];

      // Use detected device type, fallback to iphone-6.7 if unknown
      const deviceType = screenshot.deviceType === 'unknown'
        ? 'iphone-6.7'
        : screenshot.deviceType;

      try {
        const response = await fetch('/api/generate-mockup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            screenshot: screenshot.preview,
            deviceType,
            deviceColor: mockupOptions.deviceColor,
            template: mockupOptions.template,
            backgroundColor: mockupOptions.backgroundColor,
            headline: mockupOptions.headline,
            fontFamily: mockupOptions.fontFamily,
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const mockupUrl = URL.createObjectURL(blob);
          updateScreenshotMockup(screenshot.id, mockupUrl);
        } else {
          failedCount++;
          const errorData = await response.json().catch(() => ({}));
          console.error(`Failed to generate mockup:`, errorData);
        }
      } catch (err) {
        failedCount++;
        console.error(`Failed to generate mockup for ${screenshot.id}:`, err);
      }

      setGeneratedCount(i + 1);
    }

    if (failedCount > 0) {
      setError(`${failedCount} mockup(s) failed to generate. Check console for details.`);
    }

    setIsGeneratingMockups(false);
  }, [
    screenshots,
    mockupOptions,
    setIsGeneratingMockups,
    updateScreenshotMockup,
  ]);

  const mockupsGenerated = screenshots.filter((s) => s.mockupUrl).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Generated Mockups</h3>
          <p className="text-sm text-muted-foreground">
            {mockupsGenerated} of {screenshots.length} screenshots
          </p>
        </div>
        <Button
          onClick={generateMockups}
          disabled={isGeneratingMockups || screenshots.length === 0}
        >
          {isGeneratingMockups
            ? `Generating... (${generatedCount}/${screenshots.length})`
            : mockupsGenerated > 0
              ? 'Regenerate All'
              : 'Generate Mockups'}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Mockup Grid */}
      {mockupsGenerated > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {screenshots
            .filter((s) => s.mockupUrl)
            .map((screenshot) => (
              <Card key={screenshot.id} className="overflow-hidden">
                <div className="relative aspect-[9/19.5]">
                  <Image
                    src={screenshot.mockupUrl!}
                    alt={`Mockup ${screenshot.id}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
