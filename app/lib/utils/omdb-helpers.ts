export interface OMDbSearchParams {
  imdbId?: string;
  title?: string;
  year?: string | number;
}

export interface OMDbMovieData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

/**
 * Builds OMDb API URL for movie details
 */
export function buildOMDbMovieUrl(params: OMDbSearchParams, apiKey: string): string {
  const url = new URL('http://www.omdbapi.com/');
  url.searchParams.set('apikey', apiKey);

  if (params.imdbId) {
    url.searchParams.set('i', params.imdbId);
  } else if (params.title && params.year) {
    url.searchParams.set('t', params.title);
    url.searchParams.set('y', params.year.toString());
  } else {
    throw new Error('Either imdbId or both title and year must be provided');
  }

  url.searchParams.set('plot', 'full');
  url.searchParams.set('r', 'json');

  return url.toString();
}

/**
 * Builds OMDb Poster API URL
 */
export function buildOMDbPosterUrl(params: OMDbSearchParams, apiKey: string): string {
  const url = new URL('http://img.omdbapi.com/');
  url.searchParams.set('apikey', apiKey);

  if (params.imdbId) {
    url.searchParams.set('i', params.imdbId);
  } else if (params.title && params.year) {
    url.searchParams.set('t', params.title);
    url.searchParams.set('y', params.year.toString());
  } else {
    throw new Error('Either imdbId or both title and year must be provided');
  }

  return url.toString();
}

/**
 * Validates OMDb search parameters
 */
export function validateOMDbParams(params: OMDbSearchParams): boolean {
  if (params.imdbId) {
    return params.imdbId.startsWith('tt') && params.imdbId.length >= 7;
  }

  if (params.title && params.year) {
    const year = parseInt(params.year.toString(), 10);
    return params.title.trim().length > 0 && year >= 1888 && year <= new Date().getFullYear() + 1;
  }

  return false;
}

/**
 * Formats movie data for consistent response
 */
export function formatMovieData(data: OMDbMovieData) {
  return {
    title: data.Title,
    year: parseInt(data.Year, 10),
    rated: data.Rated,
    released: data.Released,
    runtime: data.Runtime,
    genre: data.Genre.split(', '),
    director: data.Director,
    writer: data.Writer,
    actors: data.Actors.split(', '),
    plot: data.Plot,
    poster: data.Poster,
    ratings: data.Ratings,
    metascore: data.Metascore !== 'N/A' ? parseInt(data.Metascore, 10) : null,
    imdbRating: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : null,
    imdbVotes: data.imdbVotes !== 'N/A' ? parseInt(data.imdbVotes.replace(/,/g, ''), 10) : null,
    imdbId: data.imdbID,
    type: data.Type,
    boxOffice: data.BoxOffice !== 'N/A' ? data.BoxOffice : null,
    production: data.Production !== 'N/A' ? data.Production : null,
  };
}
