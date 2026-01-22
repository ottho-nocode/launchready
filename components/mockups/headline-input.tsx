'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'SF Pro', label: 'SF Pro' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
];

export function HeadlineInput() {
  const { mockupOptions, setHeadline, setFontFamily } = useAppStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headline">Headline Text</Label>
        <Input
          id="headline"
          value={mockupOptions.headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Your amazing feature!"
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground">
          {mockupOptions.headline.length}/50 characters (used for Text Overlay
          template)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font">Font Family</Label>
        <Select
          value={mockupOptions.fontFamily}
          onValueChange={setFontFamily}
        >
          <SelectTrigger id="font">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
