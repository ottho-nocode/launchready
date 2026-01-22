'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/app-store';

export function ExportOptions() {
  const { exportOptions, setExportOption } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Device Sizes */}
      <div className="space-y-3">
        <Label className="text-base">Include Mockups For</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="iphone67"
              checked={exportOptions.includeIphone67}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeIphone67', checked === true)
              }
            />
            <Label htmlFor="iphone67" className="font-normal">
              iPhone 6.7&quot; (1290 × 2796)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="iphone65"
              checked={exportOptions.includeIphone65}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeIphone65', checked === true)
              }
            />
            <Label htmlFor="iphone65" className="font-normal">
              iPhone 6.5&quot; (1242 × 2688)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="iphone61"
              checked={exportOptions.includeIphone61}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeIphone61', checked === true)
              }
            />
            <Label htmlFor="iphone61" className="font-normal">
              iPhone 6.1&quot; (1284 × 2778)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="iphone55"
              checked={exportOptions.includeIphone55}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeIphone55', checked === true)
              }
            />
            <Label htmlFor="iphone55" className="font-normal">
              iPhone 5.5&quot; (1242 × 2208)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ipad129"
              checked={exportOptions.includeIpad129}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeIpad129', checked === true)
              }
            />
            <Label htmlFor="ipad129" className="font-normal">
              iPad 12.9&quot; (2048 × 2732)
            </Label>
          </div>
        </div>
      </div>

      {/* Text Files */}
      <div className="space-y-3">
        <Label className="text-base">Include Text Files</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="textsJson"
              checked={exportOptions.includeTextsJson}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeTextsJson', checked === true)
              }
            />
            <Label htmlFor="textsJson" className="font-normal">
              texts.json (structured data)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="textsTxt"
              checked={exportOptions.includeTextsTxt}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeTextsTxt', checked === true)
              }
            />
            <Label htmlFor="textsTxt" className="font-normal">
              texts.txt (plain text)
            </Label>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="space-y-3">
        <Label className="text-base">Include Documentation</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="readme"
              checked={exportOptions.includeReadme}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setExportOption('includeReadme', checked === true)
              }
            />
            <Label htmlFor="readme" className="font-normal">
              README.md (folder structure & guidelines)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
