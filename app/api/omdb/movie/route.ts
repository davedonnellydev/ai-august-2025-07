import { NextRequest, NextResponse } from 'next/server';
import {
  buildOMDbMovieUrl,
  formatMovieData,
  OMDbSearchParams,
  validateOMDbParams,
} from '@/app/lib/utils/omdb-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('i');
    const title = searchParams.get('t');
    const year = searchParams.get('y');
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OMDb API key not configured' }, { status: 500 });
    }

    // Build search parameters object
    const searchParamsObj: OMDbSearchParams = {};
    if (imdbId) {
      searchParamsObj.imdbId = imdbId;
    }
    if (title) {
      searchParamsObj.title = title;
    }
    if (year) {
      searchParamsObj.year = year;
    }

    // Validate input parameters
    if (!validateOMDbParams(searchParamsObj)) {
      return NextResponse.json(
        {
          error:
            'Either imdb_id (i) or both title (t) and year (y) must be provided. imdb_id must start with "tt" and title/year must be valid.',
        },
        { status: 400 }
      );
    }

    // Build OMDb API URL
    const omdbUrl = buildOMDbMovieUrl(searchParamsObj, apiKey);

    // Make request to OMDb API
    const response = await fetch(omdbUrl);

    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }

    const data = await response.json();

    // Check for OMDb API errors
    if (data.Error) {
      return NextResponse.json({ error: data.Error }, { status: 404 });
    }

    // Format the response data
    const formattedData = formatMovieData(data);

    return NextResponse.json({
      success: true,
      data: formattedData,
      source: 'OMDb API',
    });
  } catch (error) {
    console.error('OMDb movie API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch movie data';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
