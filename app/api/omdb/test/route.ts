import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'OMDb API Test Endpoint',
    endpoints: {
      movie: '/api/omdb/movie',
      poster: '/api/omdb/poster',
    },
    examples: {
      byImdbId: {
        movie: '/api/omdb/movie?i=tt3896198',
        poster: '/api/omdb/poster?i=tt3896198',
      },
      byTitleAndYear: {
        movie: '/api/omdb/movie?t=Guardians of the Galaxy Vol. 2&y=2017',
        poster: '/api/omdb/poster?t=Guardians of the Galaxy Vol. 2&y=2017',
      },
    },
    parameters: {
      i: 'IMDb ID (e.g., tt3896198)',
      t: 'Movie title',
      y: 'Release year',
    },
    note: 'Either provide imdb_id (i) OR both title (t) and year (y)',
  });
}
