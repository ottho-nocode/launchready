'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { TextEditor } from './text-editor';
import type { GeneratedTexts } from '@/types/app';

const TEXT_FIELDS: {
  key: keyof GeneratedTexts;
  label: string;
  maxLength: number;
  multiline: boolean;
  placeholder: string;
}[] = [
  {
    key: 'appName',
    label: 'App Name',
    maxLength: 30,
    multiline: false,
    placeholder: 'Your app name',
  },
  {
    key: 'subtitle',
    label: 'Subtitle',
    maxLength: 30,
    multiline: false,
    placeholder: 'A short tagline',
  },
  {
    key: 'promoText',
    label: 'Promotional Text',
    maxLength: 170,
    multiline: true,
    placeholder: 'Promotional text for App Store',
  },
  {
    key: 'description',
    label: 'Description',
    maxLength: 4000,
    multiline: true,
    placeholder: 'Full app description',
  },
  {
    key: 'keywords',
    label: 'Keywords',
    maxLength: 100,
    multiline: false,
    placeholder: 'keyword1,keyword2,keyword3',
  },
];

export function GeneratedTextsDisplay() {
  const {
    generatedTexts,
    appDescription,
    language,
    updateText,
    clearGeneratedTexts,
  } = useAppStore();

  const [regeneratingField, setRegeneratingField] = useState<keyof GeneratedTexts | null>(null);

  if (!generatedTexts) {
    return null;
  }

  const handleRegenerate = async (field: keyof GeneratedTexts) => {
    setRegeneratingField(field);

    try {
      const response = await fetch('/api/regenerate-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          appDescription,
          language,
          currentValue: generatedTexts[field],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate field');
      }

      const data = await response.json();
      updateText(field, data.value);
    } catch (error) {
      console.error('Error regenerating field:', error);
    } finally {
      setRegeneratingField(null);
    }
  };

  const handleBack = () => {
    clearGeneratedTexts();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Texts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {TEXT_FIELDS.map((field) => (
          <TextEditor
            key={field.key}
            label={field.label}
            value={generatedTexts[field.key]}
            maxLength={field.maxLength}
            multiline={field.multiline}
            placeholder={field.placeholder}
            onChange={(value) => updateText(field.key, value)}
            onRegenerate={() => handleRegenerate(field.key)}
            isRegenerating={regeneratingField === field.key}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Start Over
        </Button>
        <Button asChild>
          <Link href="/screenshots">Continue to Screenshots</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
