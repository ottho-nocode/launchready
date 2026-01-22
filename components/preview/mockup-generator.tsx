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

  const generateMockups = useCallback(async () => {
    if (screenshots.length === 0) return;

    setIsGeneratingMockups(true);
    setGeneratedCount(0);

    const validScreenshots = screenshots.filter(
      (s) => s.deviceType !== 'unknown'
    );

    for (let i = 0; i < validScreenshots.length; i++) {
      const screenshot = validScreenshots[i];

      try {
        const response = await fetch('/api/generate-mockup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            screenshot: screenshot.preview,
            deviceType: screenshot.deviceType,
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
        }
      } catch (error) {
        console.error(`Failed to generate mockup for ${screenshot.id}:`, error);
      }

      setGeneratedCount(i + 1);
    }

    setIsGeneratingMockups(false);
  }, [
    screenshots,
    mockupOptions,
    setIsGeneratingMockups,
    updateScreenshotMockup,
  ]);

  const validScreenshots = screenshots.filter((s) => s.deviceType !== 'unknown');
  const unknownCount = screenshots.length - validScreenshots.length;
  const mockupsGenerated = screenshots.filter((s) => s.mockupUrl).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Generated Mockups</h3>
          <p className="text-sm text-muted-foreground">
            {mockupsGenerated} of {validScreenshots.length} screenshots
            {unknownCount > 0 && ` (${unknownCount} unknown device skipped)`}
          </p>
        </div>
        <Button
          onClick={generateMockups}
          disabled={isGeneratingMockups || validScreenshots.length === 0}
        >
          {isGeneratingMockups
            ? `Generating... (${generatedCount}/${validScreenshots.length})`
            : mockupsGenerated > 0
              ? 'Regenerate All'
              : 'Generate Mockups'}
        </Button>
      </div>

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
