'use client';

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
import type { Language } from '@/types/app';

const MIN_CHARS = 50;

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'fr', label: 'Fran\u00e7ais' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Espa\u00f1ol' },
  { value: 'de', label: 'Deutsch' },
];

export function DescriptionForm() {
  const {
    appDescription,
    language,
    isGeneratingTexts,
    setAppDescription,
    setLanguage,
  } = useAppStore();

  const charCount = appDescription.length;
  const isValid = charCount >= MIN_CHARS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: Trigger text generation (will be implemented in STORY-2.2)
    console.log('Generate texts for:', { appDescription, language });
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

        <CardFooter>
          <Button type="submit" disabled={!isValid || isGeneratingTexts} className="w-full sm:w-auto">
            {isGeneratingTexts ? 'Generating...' : 'Generate Texts'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
