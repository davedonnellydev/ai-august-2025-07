import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MODEL } from '@/app/config/constants';
import { InputValidator, ServerRateLimiter } from '@/app/lib/utils/api-helpers';

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Server-side rate limiting
    if (!ServerRateLimiter.checkLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { searchOptions } = await request.json();

    // Enhanced validation
    const textValidation = InputValidator.validateText(searchOptions.description, 2000);
    if (!textValidation.isValid) {
      return NextResponse.json({ error: textValidation.error }, { status: 400 });
    }

    // Environment validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Translation service temporarily unavailable' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    // Enhanced content moderation
    const moderatedText = await client.moderations.create({
        input: searchOptions.description,
    });

    const { flagged, categories } = moderatedText.results[0];

    if (flagged) {
      const keys: string[] = Object.keys(categories);
      const flaggedCategories = keys.filter(
        (key: string) => categories[key as keyof typeof categories]
      );
      return NextResponse.json(
        {
          error: `Content flagged as inappropriate: ${flaggedCategories.join(', ')}`,
        },
        { status: 400 }
      );
    }




    const instructions: string =
      'You are a movie recommendations application with a database of all movies on IMDb. Your role is to interpret the options given by the user and return a list of movie titles and release years matching their search options';

      let userInput: string = ''

      if(searchOptions.categories.length > 0) {
        userInput += `I'm looking for movies that match the following genres: ${searchOptions.genres.join(", ")}. `
      }

      if(searchOptions.categories.length > 0) {
        userInput += `Ensure the movie selections fall under the following categories: ${searchOptions.categories.join(", ")}. `
      }

      if(searchOptions.description) {
        userInput += `${searchOptions.description}`
     }


    const response = await client.responses.create({
      model: MODEL,
      instructions,
      input: userInput,
    });

    if (response.status !== 'completed') {
      throw new Error(`Responses API error: ${response.status}`);
    }

    return NextResponse.json({
      response: response.output_text || 'Response recieved',
      originalInput: searchOptions,
      remainingRequests: ServerRateLimiter.getRemaining(ip),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
