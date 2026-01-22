'use client';

import { Container } from '@/components/layout';
import { ScreenshotDropzone, ScreenshotGrid } from '@/components/screenshots';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';

export default function ScreenshotsPage() {
  const { screenshots } = useAppStore();

  return (
    <div className="py-8">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Upload Screenshots</h1>
            <p className="mt-2 text-muted-foreground">
              Add your app screenshots to generate mockups for App Store Connect.
            </p>
          </div>

          <div className="space-y-8">
            <ScreenshotDropzone />

            {screenshots.length > 0 && (
              <>
                <div>
                  <h2 className="mb-4 text-lg font-semibold">
                    Your Screenshots ({screenshots.length}/10)
                  </h2>
                  <ScreenshotGrid />
                </div>

                <div className="flex justify-end">
                  <Button asChild>
                    <Link href="/mockups">Continue to Mockups</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
