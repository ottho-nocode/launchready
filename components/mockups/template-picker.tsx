'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { MockupTemplate } from '@/types/app';

interface Template {
  id: MockupTemplate;
  name: string;
  description: string;
  preview: React.ReactNode;
}

const TEMPLATES: Template[] = [
  {
    id: 'app-store',
    name: 'App Store',
    description: 'Style Todoist avec titre et ombre',
    preview: (
      <div className="flex h-full flex-col items-center justify-start bg-gradient-to-b from-amber-100 to-amber-200 p-2 pt-3">
        <div className="mb-1 h-1 w-10 rounded bg-gray-800" />
        <div className="h-12 w-6 rounded-lg bg-white shadow-lg" />
      </div>
    ),
  },
  {
    id: 'frame',
    name: 'Device Frame',
    description: 'Screenshot dans un cadre iPhone',
    preview: (
      <div className="flex h-full items-center justify-center bg-indigo-500 p-2">
        <div className="h-16 w-8 rounded-lg border-4 border-gray-800 bg-gray-100" />
      </div>
    ),
  },
  {
    id: 'gradient',
    name: 'Gradient BG',
    description: 'Screenshot sur fond dégradé',
    preview: (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
        <div className="h-14 w-7 rounded-lg bg-gray-100 shadow-lg" />
      </div>
    ),
  },
  {
    id: 'text-overlay',
    name: 'Text Overlay',
    description: 'Titre + screenshot',
    preview: (
      <div className="flex h-full flex-col items-center justify-center bg-indigo-500 p-2">
        <div className="mb-1 h-1.5 w-12 rounded bg-white" />
        <div className="h-12 w-6 rounded-lg bg-gray-100 shadow" />
      </div>
    ),
  },
];

export function TemplatePicker() {
  const { mockupOptions, setMockupTemplate } = useAppStore();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">Template Style</h3>
        <p className="text-sm text-muted-foreground">
          Choose how your screenshots will be displayed
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={cn(
              'cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary/50',
              mockupOptions.template === template.id &&
                'ring-2 ring-primary shadow-md'
            )}
            onClick={() => setMockupTemplate(template.id)}
          >
            <div className="aspect-[3/4] w-full">{template.preview}</div>
            <div className="border-t p-3">
              <p className="text-sm font-medium">{template.name}</p>
              <p className="text-xs text-muted-foreground">
                {template.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
