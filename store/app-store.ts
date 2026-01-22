import { create } from 'zustand';
import type {
  AppStep,
  DeviceColor,
  DeviceType,
  ExportOptions,
  GeneratedTexts,
  Language,
  MockupOptions,
  MockupTemplate,
  Screenshot,
} from '@/types/app';

interface AppState {
  // Input
  appDescription: string;
  language: Language;

  // Screenshots
  screenshots: Screenshot[];

  // Generated texts
  generatedTexts: GeneratedTexts | null;

  // Mockup options
  mockupOptions: MockupOptions;

  // Export options
  exportOptions: ExportOptions;

  // UI state
  isGeneratingTexts: boolean;
  isGeneratingMockups: boolean;
  isExporting: boolean;
  currentStep: AppStep;

  // Actions - Input
  setAppDescription: (description: string) => void;
  setLanguage: (language: Language) => void;

  // Actions - Screenshots
  addScreenshots: (screenshots: Screenshot[]) => void;
  removeScreenshot: (id: string) => void;
  reorderScreenshots: (fromIndex: number, toIndex: number) => void;
  updateScreenshotMockup: (id: string, mockupUrl: string) => void;
  updateScreenshotDevice: (id: string, deviceType: DeviceType) => void;

  // Actions - Generated texts
  setGeneratedTexts: (texts: GeneratedTexts) => void;
  updateText: (key: keyof GeneratedTexts, value: string) => void;
  clearGeneratedTexts: () => void;

  // Actions - Mockup options
  setMockupTemplate: (template: MockupTemplate) => void;
  setDeviceColor: (color: DeviceColor) => void;
  setBackgroundColor: (color: string) => void;
  setHeadline: (headline: string) => void;
  setFontFamily: (fontFamily: string) => void;

  // Actions - Export options
  setExportOption: (key: keyof ExportOptions, value: boolean) => void;

  // Actions - UI state
  setIsGeneratingTexts: (value: boolean) => void;
  setIsGeneratingMockups: (value: boolean) => void;
  setIsExporting: (value: boolean) => void;
  setCurrentStep: (step: AppStep) => void;

  // Actions - Reset
  reset: () => void;
}

const initialMockupOptions: MockupOptions = {
  template: 'app-store',
  deviceColor: 'black',
  backgroundColor: '#FEF3C7',
  headline: '',
  fontFamily: 'Inter',
};

const initialExportOptions: ExportOptions = {
  includeIphone67: true,
  includeIphone65: true,
  includeIphone61: true,
  includeIphone55: false,
  includeIpad129: false,
  includeTextsJson: true,
  includeTextsTxt: true,
  includeReadme: true,
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  appDescription: '',
  language: 'fr',
  screenshots: [],
  generatedTexts: null,
  mockupOptions: initialMockupOptions,
  exportOptions: initialExportOptions,
  isGeneratingTexts: false,
  isGeneratingMockups: false,
  isExporting: false,
  currentStep: 'input',

  // Actions - Input
  setAppDescription: (description) => set({ appDescription: description }),
  setLanguage: (language) => set({ language }),

  // Actions - Screenshots
  addScreenshots: (newScreenshots) =>
    set((state) => ({
      screenshots: [...state.screenshots, ...newScreenshots].slice(0, 10),
    })),

  removeScreenshot: (id) =>
    set((state) => ({
      screenshots: state.screenshots.filter((s) => s.id !== id),
    })),

  reorderScreenshots: (fromIndex, toIndex) =>
    set((state) => {
      const newScreenshots = [...state.screenshots];
      const [removed] = newScreenshots.splice(fromIndex, 1);
      newScreenshots.splice(toIndex, 0, removed);
      return { screenshots: newScreenshots };
    }),

  updateScreenshotMockup: (id, mockupUrl) =>
    set((state) => ({
      screenshots: state.screenshots.map((s) =>
        s.id === id ? { ...s, mockupUrl } : s
      ),
    })),

  updateScreenshotDevice: (id, deviceType) =>
    set((state) => ({
      screenshots: state.screenshots.map((s) =>
        s.id === id ? { ...s, deviceType } : s
      ),
    })),

  // Actions - Generated texts
  setGeneratedTexts: (texts) => set({ generatedTexts: texts }),

  updateText: (key, value) =>
    set((state) => ({
      generatedTexts: state.generatedTexts
        ? { ...state.generatedTexts, [key]: value }
        : null,
    })),

  clearGeneratedTexts: () => set({ generatedTexts: null }),

  // Actions - Mockup options
  setMockupTemplate: (template) =>
    set((state) => ({
      mockupOptions: { ...state.mockupOptions, template },
    })),

  setDeviceColor: (deviceColor) =>
    set((state) => ({
      mockupOptions: { ...state.mockupOptions, deviceColor },
    })),

  setBackgroundColor: (backgroundColor) =>
    set((state) => ({
      mockupOptions: { ...state.mockupOptions, backgroundColor },
    })),

  setHeadline: (headline) =>
    set((state) => ({
      mockupOptions: { ...state.mockupOptions, headline },
    })),

  setFontFamily: (fontFamily) =>
    set((state) => ({
      mockupOptions: { ...state.mockupOptions, fontFamily },
    })),

  // Actions - Export options
  setExportOption: (key, value) =>
    set((state) => ({
      exportOptions: { ...state.exportOptions, [key]: value },
    })),

  // Actions - UI state
  setIsGeneratingTexts: (value) => set({ isGeneratingTexts: value }),
  setIsGeneratingMockups: (value) => set({ isGeneratingMockups: value }),
  setIsExporting: (value) => set({ isExporting: value }),
  setCurrentStep: (step) => set({ currentStep: step }),

  // Actions - Reset
  reset: () =>
    set({
      appDescription: '',
      language: 'fr',
      screenshots: [],
      generatedTexts: null,
      mockupOptions: initialMockupOptions,
      exportOptions: initialExportOptions,
      isGeneratingTexts: false,
      isGeneratingMockups: false,
      isExporting: false,
      currentStep: 'input',
    }),
}));
