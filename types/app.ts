export type DeviceType =
  | 'iphone-6.7'
  | 'iphone-6.5'
  | 'iphone-5.5'
  | 'ipad-12.9'
  | 'unknown';

export type MockupTemplate = 'app-store' | 'frame' | 'gradient' | 'text-overlay';

export type DeviceColor = 'black' | 'white' | 'gold';

export type Language = 'fr' | 'en' | 'es' | 'de';

export interface Screenshot {
  id: string;
  file: File;
  preview: string;
  deviceType: DeviceType;
  width: number;
  height: number;
  mockupUrl?: string;
}

export interface GeneratedTexts {
  appName: string;
  subtitle: string;
  promoText: string;
  description: string;
  keywords: string;
}

export interface MockupOptions {
  template: MockupTemplate;
  deviceColor: DeviceColor;
  backgroundColor: string;
  headline: string;
  fontFamily: string;
}

export interface ExportOptions {
  includeIphone67: boolean;
  includeIphone65: boolean;
  includeIphone55: boolean;
  includeIpad129: boolean;
  includeTextsJson: boolean;
  includeTextsTxt: boolean;
  includeReadme: boolean;
}

export type AppStep = 'input' | 'customize' | 'preview' | 'export';
