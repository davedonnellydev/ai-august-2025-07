import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { MODEL } from '@/app/config/constants';
import { InputValidator, ServerRateLimiter } from '@/app/lib/utils/api-helpers';

type SearchOptions = {
  genres?: string[];
  categories?: string[];
  description?: string;
  region?: string; // e.g. "AU" or "Australia"
};

const Movie = z.object({
  title: z.string(),
  year: z.number(),
  imdb_id: z.string(), // e.g. "tt3896198"
});

const MovieRecommendations = z.object({
  list: z.array(Movie).max(10),
});

function wantsNewReleases(opts: SearchOptions) {
  const cats = (opts.categories ?? []).map((c) => c.toLowerCase());
  const descr = opts.description;
  return (
    cats.includes('new release') || descr?.includes('new releases') || descr?.includes('recent')
  );
}

function buildUserInput(opts: SearchOptions) {
  let userInput = '';

  if ((opts.genres?.length ?? 0) > 0) {
    userInput += `I'm looking for movies that match the following genres: ${opts.genres!.join(', ')}. `;
  }

  if ((opts.categories?.length ?? 0) > 0) {
    userInput += `Ensure the movie selections fall under the following categories: ${opts.categories!.join(', ')}. `;
  }

  if (opts.description) {
    userInput += opts.description.trim();
  }

  return userInput;
}

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

    // --- Parse input ---
    const { searchOptions } = (await request.json()) as { searchOptions: SearchOptions };

    if (searchOptions?.description) {
      const textValidation = InputValidator.validateText(searchOptions.description, 2000);
      if (!textValidation.isValid) {
        return NextResponse.json({ error: textValidation.error }, { status: 400 });
      }
    }

    // --- Env check ---
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 500 });
    }

    const client = new OpenAI({
      apiKey,
    });

    if (searchOptions.description) {
      // Enhanced content moderation
      const moderatedText = await client.moderations.create({
        model: 'omni-moderation-latest',
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
    }

    // --- Instructions ---
    const instructions = [
      `You are a movie recommendations engine.`,
      `Interpret the user's options and return up to 10 movies.`,
      `Always return a JSON object { list: Movie[] } conforming to the provided schema.`,
      `Each Movie must include an accurate IMDb ID (e.g., "tt3896198").`,
      `If "New Release" or similar is requested, use web search to find current releases in the specified region (default Australia).`,
      `When web searching, prefer authoritative sources (cinema chains, studio pages, IMDb, TMDb, OMDb).`,
      `Only include a movie if you can verify its imdb_id (from an IMDb URL or trusted database).`,
      `For year, use the movie's primary release year.`,
    ].join(' ');

    const userInput = buildUserInput(searchOptions ?? {});
    const shouldSearch = wantsNewReleases(searchOptions ?? {});

    // --- Conditionally enable web_search tool ---
    // If "New Release" is requested, include the web_search tool and require it.
    // Otherwise, omit tools so the model relies on its parametric knowledge.
    const baseRequest: any = {
      model: shouldSearch ? 'gpt-5-mini-2025-08-07' : MODEL, // optional: stronger freshness when searching
      instructions,
      input: [
        {
          role: 'user',
          // include region hint to bias search results
          content: `${userInput}${searchOptions?.region ? ` Region: ${searchOptions.region}.` : ' Region: Australia.'}`,
        },
      ],
      text: {
        format: zodTextFormat(MovieRecommendations, 'movie_recommendations'),
      },
    };

    if (shouldSearch) {
      baseRequest.tools = [{ type: 'web_search_preview' }];
      baseRequest.tool_choice = 'auto';
    }

    const response = await client.responses.parse(baseRequest);

    if (response.status !== 'completed') {
      throw new Error(`Responses API error: ${response.status}`);
    }

    return NextResponse.json({
      response: response.output_parsed || 'Response recieved',
      originalInput: searchOptions,
      remainingRequests: ServerRateLimiter.getRemaining(ip),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
