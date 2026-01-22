import type { DeviceType, Screenshot } from '@/types/app';

// Official App Store Connect screenshot dimensions
const DEVICE_DIMENSIONS: Record<DeviceType, { width: number; height: number }> = {
  'iphone-6.7': { width: 1290, height: 2796 }, // iPhone 14 Pro Max, 15 Pro Max
  'iphone-6.5': { width: 1242, height: 2688 }, // iPhone 11 Pro Max, XS Max
  'iphone-6.1': { width: 1284, height: 2778 }, // iPhone 12 Pro, 13 Pro, 14 Pro
  'iphone-5.5': { width: 1242, height: 2208 }, // iPhone 8 Plus, 7 Plus, 6s Plus
  'ipad-12.9': { width: 2048, height: 2732 },  // iPad Pro 12.9"
  unknown: { width: 0, height: 0 },
};

// Aspect ratios for detection
const DEVICE_RATIOS: { device: DeviceType; ratio: number }[] = [
  { device: 'iphone-6.7', ratio: 2796 / 1290 }, // ~2.17
  { device: 'iphone-6.1', ratio: 2778 / 1284 }, // ~2.16
  { device: 'iphone-6.5', ratio: 2688 / 1242 }, // ~2.16
  { device: 'iphone-5.5', ratio: 2208 / 1242 }, // ~1.78
  { device: 'ipad-12.9', ratio: 2732 / 2048 },  // ~1.33
];

export const DEVICE_OPTIONS: { value: DeviceType; label: string }[] = [
  { value: 'iphone-6.7', label: 'iPhone 6.7"' },
  { value: 'iphone-6.5', label: 'iPhone 6.5"' },
  { value: 'iphone-6.1', label: 'iPhone 6.1"' },
  { value: 'iphone-5.5', label: 'iPhone 5.5"' },
  { value: 'ipad-12.9', label: 'iPad 12.9"' },
];

export function detectDeviceType(width: number, height: number): DeviceType {
  // Normalize to portrait orientation
  const w = Math.min(width, height);
  const h = Math.max(width, height);

  // First try exact match with tolerance
  for (const [device, dims] of Object.entries(DEVICE_DIMENSIONS)) {
    if (device === 'unknown') continue;

    const dw = Math.min(dims.width, dims.height);
    const dh = Math.max(dims.width, dims.height);

    // Allow 5% tolerance for dimensions
    const tolerance = 0.05;
    if (
      Math.abs(w - dw) / dw <= tolerance &&
      Math.abs(h - dh) / dh <= tolerance
    ) {
      return device as DeviceType;
    }
  }

  // Fallback: detect by aspect ratio
  const aspectRatio = h / w;

  let bestMatch: DeviceType = 'iphone-6.7'; // Default to most common
  let bestDiff = Infinity;

  for (const { device, ratio } of DEVICE_RATIOS) {
    const diff = Math.abs(aspectRatio - ratio);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestMatch = device;
    }
  }

  // If ratio is close enough (within 15%), use the match
  if (bestDiff / DEVICE_RATIOS.find(d => d.device === bestMatch)!.ratio <= 0.15) {
    return bestMatch;
  }

  // Return best guess anyway for phone-like ratios
  if (aspectRatio > 1.5) {
    return 'iphone-6.7'; // Default to iPhone for tall images
  }

  return 'ipad-12.9'; // Default to iPad for wider images
}

export function generateScreenshotId(): string {
  return `screenshot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function processFile(file: File): Promise<Screenshot> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const deviceType = detectDeviceType(img.width, img.height);

        resolve({
          id: generateScreenshotId(),
          file,
          preview: reader.result as string,
          deviceType,
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function processFiles(files: File[]): Promise<Screenshot[]> {
  const screenshots = await Promise.all(files.map(processFile));
  return screenshots;
}
