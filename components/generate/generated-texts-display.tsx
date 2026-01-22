'use client';

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
  const { generatedTexts, updateText, clearGeneratedTexts, setCurrentStep } = useAppStore();

  if (!generatedTexts) {
    return null;
  }

  const handleBack = () => {
    clearGeneratedTexts();
    setCurrentStep('input');
  };

  const handleContinue = () => {
    setCurrentStep('preview');
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
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Start Over
        </Button>
        <Button onClick={handleContinue}>Continue to Preview</Button>
      </CardFooter>
    </Card>
  );
}
