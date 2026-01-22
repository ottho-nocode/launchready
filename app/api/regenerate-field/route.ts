import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import type { GeneratedTexts, Language } from '@/types/app';

const FIELD_CONFIG: Record<
  keyof GeneratedTexts,
  { maxLength: number; description: string; instruction: string }
> = {
  appName: {
    maxLength: 30,
    description: 'App Name',
    instruction: 'Create a memorable and descriptive app name.',
  },
  subtitle: {
    maxLength: 30,
    description: 'Subtitle',
    instruction: 'Write a short tagline that highlights the main benefit.',
  },
  promoText: {
    maxLength: 170,
    description: 'Promotional Text',
    instruction:
      'Write promotional text that can be updated anytime. Focus on current features or promotions.',
  },
  description: {
    maxLength: 4000,
    description: 'Description',
    instruction:
      'Write a full app description with features, benefits, and a call to action. Use line breaks for readability.',
  },
  keywords: {
    maxLength: 100,
    description: 'Keywords',
    instruction:
      'Generate comma-separated keywords for App Store search. No spaces after commas. Focus on searchable terms.',
  },
};

const requestSchema = z.object({
  field: z.enum(['appName', 'subtitle', 'promoText', 'description', 'keywords']),
  appDescription: z.string().min(50, 'Description must be at least 50 characters'),
  language: z.enum(['fr', 'en', 'es', 'de']),
  currentValue: z.string().optional(),
});

const LANGUAGE_NAMES: Record<Language, string> = {
  fr: 'French',
  en: 'English',
  es: 'Spanish',
  de: 'German',
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { field, appDescription, language, currentValue } = parsed.data;
    const languageName = LANGUAGE_NAMES[language];
    const config = FIELD_CONFIG[field];

    const prompt = `You are an expert App Store Optimization (ASO) specialist. Generate a new ${config.description} for an app based on the following description.

APP DESCRIPTION:
${appDescription}

FIELD TO GENERATE: ${config.description}
MAX LENGTH: ${config.maxLength} characters
INSTRUCTION: ${config.instruction}

${currentValue ? `CURRENT VALUE (generate something DIFFERENT):\n${currentValue}` : ''}

Generate the text in ${languageName}. Follow Apple's App Store guidelines strictly.

IMPORTANT:
- Respect the ${config.maxLength} character limit strictly
- Write naturally and persuasively
- Focus on user benefits
${currentValue ? '- Make it noticeably different from the current value' : ''}

Respond with a JSON object containing only the field "${field}" with the new value.`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an ASO expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9, // Higher temperature for more variation
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }

    const result = JSON.parse(content);
    let value = result[field] as string;

    // Enforce character limit
    if (value && value.length > config.maxLength) {
      value = value.slice(0, config.maxLength);
    }

    return NextResponse.json({ field, value });
  } catch (error) {
    console.error('Error regenerating field:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'OpenAI API error', message: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
