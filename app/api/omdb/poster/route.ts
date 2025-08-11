import { NextRequest, NextResponse } from 'next/server';
import {
  buildOMDbPosterUrl,
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

    // Build OMDb Poster API URL
    const posterUrl = buildOMDbPosterUrl(searchParamsObj, apiKey);

    // Make request to OMDb Poster API
    const response = await fetch(posterUrl);

    if (!response.ok) {
      throw new Error(`OMDb Poster API error: ${response.status}`);
    }

    // Check if we got an image response
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      // If no image, return error
      return NextResponse.json({ error: 'No poster found for this movie' }, { status: 404 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('OMDb poster API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch movie poster';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
