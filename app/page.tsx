'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MockupTemplate {
  id: string;
  name: string;
  thumbnail: string;
}

const TEMPLATES: MockupTemplate[] = [
  {
    id: 'blue-waves',
    name: 'Blue Waves',
    thumbnail: '/templates/frame-template.jpg',
  },
];

export default function MockupGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<MockupTemplate>(TEMPLATES[0]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [headline, setHeadline] = useState('Votre texte\npromotionnel ici');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string);
        setGeneratedMockup(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string);
        setGeneratedMockup(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Generate mockup via API
  const generateMockup = useCallback(async () => {
    if (!screenshot) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-mockup-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          screenshot,
          headline,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedMockup(url);
      } else {
        const error = await response.json();
        console.error('Failed to generate mockup:', error);
        alert('Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Error generating mockup:', error);
      alert('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  }, [screenshot, headline, selectedTemplate]);

  // Download mockup
  const downloadMockup = useCallback(() => {
    if (generatedMockup) {
      const a = document.createElement('a');
      a.href = generatedMockup;
      a.download = `mockup-${Date.now()}.png`;
      a.click();
    }
  }, [generatedMockup]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Mockup Generator</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card className="p-4">
              <Label className="mb-3 block text-lg font-medium">Template</Label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setGeneratedMockup(null);
                    }}
                    className={cn(
                      'overflow-hidden rounded-lg border-2 transition-all',
                      selectedTemplate.id === template.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="aspect-[9/19] w-full object-cover"
                    />
                    <div className="bg-white p-2 text-center text-xs font-medium">
                      {template.name}
                    </div>
                  </button>
                ))}

                {/* Add template placeholder */}
                <button
                  className="flex aspect-[9/19] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
                  onClick={() => alert('Fonctionnalité bientôt disponible')}
                >
                  <span className="text-3xl">+</span>
                  <span className="mt-1 text-xs">Ajouter</span>
                </button>
              </div>
            </Card>

            {/* Screenshot Upload */}
            <Card className="p-4">
              <Label className="mb-3 block text-lg font-medium">Screenshot</Label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
                  screenshot
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                {screenshot ? (
                  <div className="text-center">
                    <img
                      src={screenshot}
                      alt="Screenshot"
                      className="mx-auto mb-2 h-32 rounded object-contain"
                    />
                    <p className="text-sm text-green-600">Image chargee</p>
                    <p className="text-xs text-gray-500">Cliquez pour changer</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-4xl text-gray-400">📱</div>
                    <p className="text-sm text-gray-600">
                      Glissez votre screenshot ici
                    </p>
                    <p className="text-xs text-gray-400">ou cliquez pour parcourir</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </Card>

            {/* Text Editor */}
            <Card className="p-4">
              <Label className="mb-3 block text-lg font-medium">Texte promotionnel</Label>
              <Textarea
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  setGeneratedMockup(null);
                }}
                placeholder="Entrez votre texte..."
                rows={4}
                className="resize-none text-lg"
              />
              <p className="mt-2 text-xs text-gray-500">
                Utilisez Entree pour creer des lignes multiples
              </p>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={generateMockup}
              disabled={!screenshot || isGenerating}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isGenerating ? 'Generation...' : 'Generer le mockup'}
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-4">
            <Card className="overflow-hidden p-4">
              <div className="mb-3 flex items-center justify-between">
                <Label className="text-lg font-medium">Apercu</Label>
                {generatedMockup && (
                  <Button onClick={downloadMockup} variant="outline" size="sm">
                    Telecharger
                  </Button>
                )}
              </div>

              <div className="flex aspect-[9/19] items-center justify-center rounded-lg bg-gray-100">
                {generatedMockup ? (
                  <img
                    src={generatedMockup}
                    alt="Generated mockup"
                    className="h-full w-full object-contain"
                  />
                ) : screenshot ? (
                  <div className="relative h-full w-full">
                    <img
                      src={selectedTemplate.thumbnail}
                      alt="Template preview"
                      className="h-full w-full object-contain opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="rounded bg-black/50 px-4 py-2 text-white">
                        Cliquez sur Generer pour voir le resultat
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <p className="text-lg">Apercu du mockup</p>
                    <p className="text-sm">Uploadez un screenshot pour commencer</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
