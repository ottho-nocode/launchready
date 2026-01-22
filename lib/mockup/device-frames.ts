import type { DeviceColor, DeviceType } from '@/types/app';

export interface DeviceFrame {
  // Device info
  name: string;
  deviceType: DeviceType;

  // Screen dimensions (where screenshot goes)
  screenWidth: number;
  screenHeight: number;

  // Frame dimensions (total mockup size)
  frameWidth: number;
  frameHeight: number;

  // Screen position within frame
  screenOffsetX: number;
  screenOffsetY: number;

  // Frame styling
  cornerRadius: number;
  bezelWidth: number;
  notchHeight?: number;
  homeButtonRadius?: number;
}

// Device frame configurations for App Store mockups
export const DEVICE_FRAMES: Record<Exclude<DeviceType, 'unknown'>, DeviceFrame> = {
  'iphone-6.7': {
    name: 'iPhone 14 Pro Max / 15 Pro Max',
    deviceType: 'iphone-6.7',
    screenWidth: 1290,
    screenHeight: 2796,
    frameWidth: 1370,
    frameHeight: 2876,
    screenOffsetX: 40,
    screenOffsetY: 40,
    cornerRadius: 110,
    bezelWidth: 40,
    notchHeight: 140, // Dynamic Island
  },
  'iphone-6.5': {
    name: 'iPhone 11 Pro Max / XS Max',
    deviceType: 'iphone-6.5',
    screenWidth: 1242,
    screenHeight: 2688,
    frameWidth: 1322,
    frameHeight: 2768,
    screenOffsetX: 40,
    screenOffsetY: 40,
    cornerRadius: 100,
    bezelWidth: 40,
    notchHeight: 120, // Notch
  },
  'iphone-5.5': {
    name: 'iPhone 8 Plus / 7 Plus / 6s Plus',
    deviceType: 'iphone-5.5',
    screenWidth: 1242,
    screenHeight: 2208,
    frameWidth: 1322,
    frameHeight: 2368,
    screenOffsetX: 40,
    screenOffsetY: 80,
    cornerRadius: 80,
    bezelWidth: 40,
    homeButtonRadius: 100, // Home button
  },
  'ipad-12.9': {
    name: 'iPad Pro 12.9"',
    deviceType: 'ipad-12.9',
    screenWidth: 2048,
    screenHeight: 2732,
    frameWidth: 2148,
    frameHeight: 2832,
    screenOffsetX: 50,
    screenOffsetY: 50,
    cornerRadius: 60,
    bezelWidth: 50,
  },
};

// Colors for device frames
export const DEVICE_COLORS: Record<DeviceColor, { frame: string; bezel: string }> = {
  black: {
    frame: '#1a1a1a',
    bezel: '#2a2a2a',
  },
  white: {
    frame: '#f5f5f5',
    bezel: '#e0e0e0',
  },
  gold: {
    frame: '#d4af37',
    bezel: '#c5a028',
  },
};

export function getDeviceFrame(deviceType: DeviceType): DeviceFrame | null {
  if (deviceType === 'unknown') {
    return null;
  }
  return DEVICE_FRAMES[deviceType];
}

export function getDeviceColors(color: DeviceColor) {
  return DEVICE_COLORS[color];
}
