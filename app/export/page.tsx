'use client';

import { useState } from 'react';
import { Container } from '@/components/layout';
import { ExportOptions } from '@/components/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { countExportItems, generateExportZip } from '@/lib/export-utils';
import Link from 'next/link';

export default function ExportPage() {
  const {
    generatedTexts,
    screenshots,
    exportOptions,
    isExporting,
    setIsExporting,
  } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const { textFiles, mockups } = countExportItems(
    generatedTexts,
    screenshots,
    exportOptions
  );

  const hasContent = textFiles > 0 || mockups > 0;
  const mockupsGenerated = screenshots.filter((s) => s.mockupUrl).length;

  const handleExport = async () => {
    setError(null);
    setIsExporting(true);

    try {
      await generateExportZip({
        texts: generatedTexts,
        screenshots,
        options: exportOptions,
        appName: generatedTexts?.appName,
      });
    } catch (err) {
      setError('Failed to generate export. Please try again.');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!generatedTexts && mockupsGenerated === 0) {
    return (
      <div className="py-8">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight">Export</h1>
            <p className="mt-4 text-muted-foreground">
              Generate texts and mockups before exporting.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild>
                <Link href="/generate">Generate Texts</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/preview">Generate Mockups</Link>
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
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Export</h1>
            <p className="mt-2 text-muted-foreground">
              Download your App Store assets as a ZIP file
            </p>
          </div>

          {/* Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Export Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-3xl font-bold">{textFiles}</p>
                  <p className="text-sm text-muted-foreground">Text Files</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-3xl font-bold">{mockups}</p>
                  <p className="text-sm text-muted-foreground">Mockups</p>
                </div>
              </div>
              {generatedTexts && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  App: <span className="font-medium">{generatedTexts.appName}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <ExportOptions />
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-center text-destructive">
              {error}
            </div>
          )}

          {/* Export Button */}
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              onClick={handleExport}
              disabled={isExporting || !hasContent}
              className="w-full"
            >
              {isExporting ? 'Generating ZIP...' : 'Download ZIP'}
            </Button>

            {!hasContent && (
              <p className="text-center text-sm text-muted-foreground">
                Select at least one option to export
              </p>
            )}
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Button asChild variant="link">
              <Link href="/preview">← Back to Preview</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
