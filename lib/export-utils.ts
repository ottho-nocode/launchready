import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ExportOptions, GeneratedTexts, Screenshot } from '@/types/app';

interface ExportData {
  texts: GeneratedTexts | null;
  screenshots: Screenshot[];
  options: ExportOptions;
  appName?: string;
}

const DEVICE_FOLDER_NAMES: Record<string, string> = {
  'iphone-6.7': 'iPhone_6.7',
  'iphone-6.5': 'iPhone_6.5',
  'iphone-5.5': 'iPhone_5.5',
  'ipad-12.9': 'iPad_12.9',
};

export async function generateExportZip(data: ExportData): Promise<void> {
  const zip = new JSZip();
  const { texts, screenshots, options, appName } = data;
  const folderName = appName?.replace(/[^a-zA-Z0-9]/g, '_') || 'app_store_assets';

  const root = zip.folder(folderName)!;

  // Add texts
  if (texts) {
    const textsFolder = root.folder('texts')!;

    if (options.includeTextsJson) {
      textsFolder.file('texts.json', JSON.stringify(texts, null, 2));
    }

    if (options.includeTextsTxt) {
      const txtContent = `App Name: ${texts.appName}
Subtitle: ${texts.subtitle}
Promo Text: ${texts.promoText}

Description:
${texts.description}

Keywords:
${texts.keywords}`;
      textsFolder.file('texts.txt', txtContent);
    }
  }

  // Add mockups by device type
  const mockupsFolder = root.folder('mockups')!;
  const screenshotsWithMockups = screenshots.filter((s) => s.mockupUrl);

  for (const screenshot of screenshotsWithMockups) {
    const deviceFolder = DEVICE_FOLDER_NAMES[screenshot.deviceType] || 'unknown';
    const folder = mockupsFolder.folder(deviceFolder)!;

    // Only include if the corresponding option is enabled
    const shouldInclude =
      (screenshot.deviceType === 'iphone-6.7' && options.includeIphone67) ||
      (screenshot.deviceType === 'iphone-6.5' && options.includeIphone65) ||
      (screenshot.deviceType === 'iphone-5.5' && options.includeIphone55) ||
      (screenshot.deviceType === 'ipad-12.9' && options.includeIpad129);

    if (shouldInclude && screenshot.mockupUrl) {
      try {
        // Fetch mockup from blob URL
        const response = await fetch(screenshot.mockupUrl);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // Generate unique filename
        const filename = `mockup_${screenshot.id.slice(-6)}.png`;
        folder.file(filename, arrayBuffer);
      } catch (error) {
        console.error(`Failed to add mockup ${screenshot.id}:`, error);
      }
    }
  }

  // Add README
  if (options.includeReadme) {
    const readmeContent = `# App Store Assets

Generated with LaunchReady

## Contents

### Texts
${texts ? `
- **App Name:** ${texts.appName}
- **Subtitle:** ${texts.subtitle}
- **Promo Text:** ${texts.promoText}
- **Keywords:** ${texts.keywords}
` : 'No texts generated'}

### Screenshots
${screenshotsWithMockups.length} mockup(s) included

#### Folder Structure
\`\`\`
${folderName}/
├── texts/
│   ├── texts.json
│   └── texts.txt
├── mockups/
│   ├── iPhone_6.7/
│   ├── iPhone_6.5/
│   ├── iPhone_5.5/
│   └── iPad_12.9/
└── README.md
\`\`\`

## App Store Connect Requirements

### Screenshot Sizes
- iPhone 6.7": 1290 x 2796 pixels
- iPhone 6.5": 1242 x 2688 pixels
- iPhone 5.5": 1242 x 2208 pixels
- iPad 12.9": 2048 x 2732 pixels

### Character Limits
- App Name: 30 characters
- Subtitle: 30 characters
- Promo Text: 170 characters
- Description: 4000 characters
- Keywords: 100 characters

---
Generated on ${new Date().toLocaleDateString()}
`;
    root.file('README.md', readmeContent);
  }

  // Generate and download
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${folderName}.zip`);
}

export function countExportItems(
  texts: GeneratedTexts | null,
  screenshots: Screenshot[],
  options: ExportOptions
): { textFiles: number; mockups: number } {
  let textFiles = 0;
  if (texts) {
    if (options.includeTextsJson) textFiles++;
    if (options.includeTextsTxt) textFiles++;
  }

  const mockups = screenshots.filter((s) => {
    if (!s.mockupUrl) return false;
    if (s.deviceType === 'iphone-6.7' && options.includeIphone67) return true;
    if (s.deviceType === 'iphone-6.5' && options.includeIphone65) return true;
    if (s.deviceType === 'iphone-5.5' && options.includeIphone55) return true;
    if (s.deviceType === 'ipad-12.9' && options.includeIpad129) return true;
    return false;
  }).length;

  return { textFiles, mockups };
}
