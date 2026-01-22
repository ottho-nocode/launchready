'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';

export function AppStorePreview() {
  const { generatedTexts, screenshots } = useAppStore();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  if (!generatedTexts) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Generate texts first to see the preview
      </Card>
    );
  }

  const truncatedDescription = generatedTexts.description.slice(0, 200);
  const showMore = generatedTexts.description.length > 200;

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl bg-white p-4 shadow-xl dark:bg-gray-900">
      {/* App Header */}
      <div className="flex gap-4">
        {/* App Icon */}
        <div className="h-20 w-20 flex-shrink-0 rounded-[18px] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg" />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold">
            {generatedTexts.appName}
          </h2>
          <p className="truncate text-sm text-muted-foreground">
            {generatedTexts.subtitle}
          </p>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-3 w-3 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">4.8 (2.3K)</span>
          </div>
        </div>

        {/* Get Button */}
        <Button size="sm" className="h-8 rounded-full px-6">
          GET
        </Button>
      </div>

      {/* Screenshots Carousel */}
      {screenshots.length > 0 && (
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex gap-2">
            {screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                className="relative h-48 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100"
              >
                <Image
                  src={screenshot.mockupUrl || screenshot.preview}
                  alt={`Screenshot ${screenshot.id}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Text */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 dark:from-indigo-950/30 dark:to-purple-950/30">
        <p className="text-sm font-medium">{generatedTexts.promoText}</p>
      </Card>

      {/* Description */}
      <div>
        <p className="text-sm text-muted-foreground">
          {descriptionExpanded ? generatedTexts.description : truncatedDescription}
          {showMore && !descriptionExpanded && '...'}
        </p>
        {showMore && (
          <button
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            className="mt-1 text-sm font-medium text-primary hover:underline"
          >
            {descriptionExpanded ? 'Less' : 'More'}
          </button>
        )}
      </div>

      {/* Keywords Preview */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
          Keywords
        </p>
        <div className="flex flex-wrap gap-1">
          {generatedTexts.keywords.split(',').map((keyword, i) => (
            <span
              key={i}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
            >
              {keyword.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Developer Name</span>
        <span>Free • Offers In-App Purchases</span>
      </div>
    </div>
  );
}
