import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import type { GeneratedTexts, Language } from '@/types/app';

const requestSchema = z.object({
  description: z.string().min(50, 'Description must be at least 50 characters'),
  language: z.enum(['fr', 'en', 'es', 'de']),
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

    const { description, language } = parsed.data;
    const languageName = LANGUAGE_NAMES[language];

    const prompt = `You are an expert App Store Optimization (ASO) specialist. Generate compelling App Store texts based on the following app description.

APP DESCRIPTION:
${description}

Generate all texts in ${languageName}. Follow Apple's App Store guidelines and character limits strictly.

You MUST respond with a valid JSON object containing these exact fields:
- appName: The app name (max 30 characters). Make it memorable and descriptive.
- subtitle: A short tagline (max 30 characters). Highlight the main benefit.
- promoText: Promotional text (max 170 characters). Can be updated anytime, use for current promotions or features.
- description: Full app description (max 4000 characters). Include features, benefits, and a call to action. Use line breaks for readability.
- keywords: Comma-separated keywords (max 100 characters total). Focus on searchable terms, avoid spaces after commas.

IMPORTANT:
- Respect ALL character limits strictly
- Write naturally and persuasively
- Focus on user benefits, not just features
- Use appropriate tone for the target audience
- For keywords, maximize coverage with short, relevant terms

Respond ONLY with the JSON object, no additional text.`;

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
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    const generatedTexts: GeneratedTexts = JSON.parse(content);

    // Validate character limits
    const limits = {
      appName: 30,
      subtitle: 30,
      promoText: 170,
      description: 4000,
      keywords: 100,
    };

    for (const [key, limit] of Object.entries(limits)) {
      const value = generatedTexts[key as keyof GeneratedTexts];
      if (value && value.length > limit) {
        generatedTexts[key as keyof GeneratedTexts] = value.slice(0, limit);
      }
    }

    return NextResponse.json(generatedTexts);
  } catch (error) {
    console.error('Error generating texts:', error);

    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'API key not configured', message: 'Please set OPENAI_API_KEY in your .env.local file' },
        { status: 503 }
      );
    }

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'OpenAI API error', message: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
