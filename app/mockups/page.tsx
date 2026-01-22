'use client';

import { Container } from '@/components/layout';
import { ColorPicker, HeadlineInput, TemplatePicker } from '@/components/mockups';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';

export default function MockupsPage() {
  const { screenshots, mockupOptions } = useAppStore();

  if (screenshots.length === 0) {
    return (
      <div className="py-8">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Customize Mockups
            </h1>
            <p className="mt-4 text-muted-foreground">
              No screenshots uploaded yet. Please upload screenshots first.
            </p>
            <Button asChild className="mt-6">
              <Link href="/screenshots">Upload Screenshots</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Customize Mockups
            </h1>
            <p className="mt-2 text-muted-foreground">
              Choose template style and colors for your App Store screenshots
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Template Selection */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Template</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplatePicker />
              </CardContent>
            </Card>

            {/* Color Options */}
            <Card>
              <CardHeader>
                <CardTitle>Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorPicker />
              </CardContent>
            </Card>

            {/* Headline (for text-overlay template) */}
            <Card>
              <CardHeader>
                <CardTitle>Text Options</CardTitle>
              </CardHeader>
              <CardContent>
                <HeadlineInput />
              </CardContent>
            </Card>
          </div>

          {/* Preview Summary */}
          <Card className="mt-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Settings</p>
                  <p className="text-sm text-muted-foreground">
                    {mockupOptions.template === 'frame' && 'Device Frame'}
                    {mockupOptions.template === 'gradient' && 'Gradient Background'}
                    {mockupOptions.template === 'text-overlay' && 'Text Overlay'}{' '}
                    • {mockupOptions.deviceColor} device •{' '}
                    {screenshots.length} screenshot(s)
                  </p>
                </div>
                <Button asChild>
                  <Link href="/preview">Generate Preview</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
