'use client';

import { Container } from '@/components/layout';
import { DescriptionForm, GeneratedTextsDisplay } from '@/components/generate';
import { useAppStore } from '@/store/app-store';

export default function GeneratePage() {
  const { generatedTexts } = useAppStore();

  return (
    <div className="py-8">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {generatedTexts ? 'Edit Your Texts' : 'Generate App Store Texts'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {generatedTexts
                ? 'Review and edit the generated texts before continuing.'
                : "Describe your app and we'll generate all the texts you need for App Store Connect."}
            </p>
          </div>

          {generatedTexts ? <GeneratedTextsDisplay /> : <DescriptionForm />}
        </div>
      </Container>
    </div>
  );
}
