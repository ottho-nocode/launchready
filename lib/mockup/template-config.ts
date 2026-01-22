import type { DeviceType } from '@/types/app';

export interface TemplateConfig {
  // Template image path (relative to public/)
  imagePath: string;

  // Template dimensions
  width: number;
  height: number;

  // Screen area where screenshot is placed
  screen: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Text area for headline
  text: {
    x: number;
    y: number;
    maxWidth: number;
    fontSize: number;
    lineHeight: number;
    color: string;
    fontWeight: string;
  };
}

// Template configurations per device type
export const TEMPLATE_CONFIGS: Partial<Record<DeviceType, TemplateConfig>> = {
  'iphone-6.5': {
    imagePath: '/templates/frame-template.jpg',
    width: 1242,
    height: 2688,
    screen: {
      x: 149,
      y: 427,
      width: 939,
      height: 2260,
    },
    text: {
      x: 621, // center
      y: 220,
      maxWidth: 1000,
      fontSize: 90,
      lineHeight: 110,
      color: '#F5F5DC', // beige/cream color matching the template
      fontWeight: '700',
    },
  },
};

// For devices without a specific template, we'll generate one programmatically
export function hasImageTemplate(deviceType: DeviceType): boolean {
  return deviceType in TEMPLATE_CONFIGS;
}

export function getTemplateConfig(deviceType: DeviceType): TemplateConfig | null {
  return TEMPLATE_CONFIGS[deviceType] ?? null;
}
