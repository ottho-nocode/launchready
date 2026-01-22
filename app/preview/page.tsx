'use client';

import { Container } from '@/components/layout';
import { AppStorePreview, MockupGenerator } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';

export default function PreviewPage() {
  const { generatedTexts, screenshots } = useAppStore();

  const hasTexts = !!generatedTexts;
  const hasScreenshots = screenshots.length > 0;
  const mockupsGenerated = screenshots.filter((s) => s.mockupUrl).length > 0;

  if (!hasTexts && !hasScreenshots) {
    return (
      <div className="py-8">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight">Preview</h1>
            <p className="mt-4 text-muted-foreground">
              Generate texts and upload screenshots to see a preview.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild>
                <Link href="/generate">Generate Texts</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/screenshots">Upload Screenshots</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Preview</h1>
            <p className="mt-2 text-muted-foreground">
              Preview your App Store listing before export
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
            {/* Left Column - Mockups */}
            <div className="space-y-6">
              {/* Generate Mockups */}
              <Card>
                <CardHeader>
                  <CardTitle>Mockups</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasScreenshots ? (
                    <MockupGenerator />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No screenshots uploaded
                      </p>
                      <Button asChild variant="outline">
                        <Link href="/screenshots">Upload Screenshots</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customize Link */}
              {hasScreenshots && (
                <div className="flex justify-end">
                  <Button asChild variant="outline">
                    <Link href="/mockups">Customize Mockups</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - App Store Preview */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <h2 className="mb-4 text-lg font-medium">App Store Preview</h2>
              <AppStorePreview />
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              disabled={!hasTexts || !mockupsGenerated}
            >
              <Link href="/export">
                {hasTexts && mockupsGenerated
                  ? 'Continue to Export'
                  : 'Generate content to export'}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
