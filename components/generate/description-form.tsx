'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import type { GeneratedTexts, Language } from '@/types/app';

const MIN_CHARS = 50;

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
];

export function DescriptionForm() {
  const {
    appDescription,
    language,
    isGeneratingTexts,
    setAppDescription,
    setLanguage,
    setIsGeneratingTexts,
    setGeneratedTexts,
    setCurrentStep,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);

  const charCount = appDescription.length;
  const isValid = charCount >= MIN_CHARS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isGeneratingTexts) return;

    setError(null);
    setIsGeneratingTexts(true);

    try {
      const response = await fetch('/api/generate-texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: appDescription, language }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate texts');
      }

      const texts: GeneratedTexts = await response.json();
      setGeneratedTexts(texts);
      setCurrentStep('customize');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGeneratingTexts(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Description</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Describe your application</Label>
            <Textarea
              id="description"
              placeholder="Describe your app in detail: what it does, who it's for, its main features, and what makes it unique. The more context you provide, the better the generated texts will be..."
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              className="min-h-[150px] resize-y"
              disabled={isGeneratingTexts}
            />
            <div className="flex justify-between text-sm">
              <span className={charCount < MIN_CHARS ? 'text-muted-foreground' : 'text-green-600'}>
                {charCount} / {MIN_CHARS} characters minimum
              </span>
              {charCount < MIN_CHARS && (
                <span className="text-muted-foreground">
                  {MIN_CHARS - charCount} more characters needed
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Target language</Label>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as Language)}
              disabled={isGeneratingTexts}
            >
              <SelectTrigger id="language" className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <Button type="submit" disabled={!isValid || isGeneratingTexts} className="w-full sm:w-auto">
            {isGeneratingTexts ? 'Generating...' : 'Generate Texts'}
          </Button>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
