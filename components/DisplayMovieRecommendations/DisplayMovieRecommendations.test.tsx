import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { DisplayMovieRecommendations } from './DisplayMovieRecommendations';

// Mock data for testing
const mockRecommendations = [
  {
    title: 'Guardians of the Galaxy Vol. 2',
    year: 2017,
    imdb_id: 'tt3896198',
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    imdb_id: 'tt0468569',
  },
];

const mockOMDbData = [
  {
    title: 'Guardians of the Galaxy Vol. 2',
    year: 2017,
    rated: 'PG-13',
    released: '05 May 2017',
    runtime: '136 min',
    genre: ['Action', 'Adventure', 'Comedy'],
    director: 'James Gunn',
    writer: 'James Gunn',
    actors: ['Chris Pratt', 'Zoe Saldana', 'Dave Bautista'],
    plot: "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father the ambitious celestial being Ego.",
    poster:
      'https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00YzEwLWE0YmUtNTA2ZWIzODc2OTgxXkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg',
    ratings: [{ Source: 'Internet Movie Database', Value: '7.6/10' }],
    metascore: 67,
    imdbRating: 7.6,
    imdbVotes: 600000,
    imdbId: 'tt3896198',
    type: 'movie',
    boxOffice: '$863.8M',
    production: 'Marvel Studios',
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    rated: 'PG-13',
    released: '18 Jul 2008',
    runtime: '152 min',
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    writer: 'Jonathan Nolan',
    actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    ratings: [{ Source: 'Internet Movie Database', Value: '9.0/10' }],
    metascore: 84,
    imdbRating: 9.0,
    imdbVotes: 2500000,
    imdbId: 'tt0468569',
    type: 'movie',
    boxOffice: '$1.005B',
    production: 'Warner Bros.',
  },
];

// Mock fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockOnBack = jest.fn();

describe('DisplayMovieRecommendations', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockOnBack.mockClear();
  });

  it('renders the movie recommendations header', async () => {
    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[0] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[1] }),
      });

    render(
      <DisplayMovieRecommendations recommendations={mockRecommendations} onBack={mockOnBack} />
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Fetching movie recommendations...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Here are your personalized movie suggestions')).toBeInTheDocument();
    expect(screen.getByText('2 Movies')).toBeInTheDocument();
    expect(screen.getByText('Back to Search')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(
      <DisplayMovieRecommendations recommendations={mockRecommendations} onBack={mockOnBack} />
    );

    expect(screen.getByText('Fetching movie recommendations...')).toBeInTheDocument();
  });

  it('fetches movie data and displays movies', async () => {
    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[0] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[1] }),
      });

    render(
      <DisplayMovieRecommendations recommendations={mockRecommendations} onBack={mockOnBack} />
    );

    // Wait for loading to complete and movies to be displayed
    await waitFor(() => {
      expect(screen.getByText('Guardians of the Galaxy Vol. 2')).toBeInTheDocument();
    });
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock fetch to return a response that will cause the component to show no movies
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, error: 'Movie not found' }),
    });

    render(
      <DisplayMovieRecommendations recommendations={mockRecommendations} onBack={mockOnBack} />
    );

    // Wait for the component to finish loading and show no movies
    await waitFor(() => {
      expect(screen.queryByText('Fetching movie recommendations...')).not.toBeInTheDocument();
    });

    // Since no movies were found, the component should show the movies grid but with no content
    expect(screen.getByText('Here are your personalized movie suggestions')).toBeInTheDocument();
    expect(screen.getByText('Back to Search')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[0] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[1] }),
      });

    render(
      <DisplayMovieRecommendations recommendations={mockRecommendations} onBack={mockOnBack} />
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Guardians of the Galaxy Vol. 2')).toBeInTheDocument();
    });

    // Click back button
    const backButton = screen.getByText('Back to Search');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('opens drawer when movie card is clicked', async () => {
    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[0] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[1] }),
      });

    render(
      <DisplayMovieRecommendations recommendations={mockRecommendations} onBack={mockOnBack} />
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Guardians of the Galaxy Vol. 2')).toBeInTheDocument();
    });

    // Click on the first movie card (use the first occurrence - the card title)
    const firstMovieCard = screen
      .getAllByText('Guardians of the Galaxy Vol. 2')[0]
      .closest('.mantine-Card-root');
    fireEvent.click(firstMovieCard!);

    // Check if drawer opens with movie details
    expect(screen.getByText('Movie Details')).toBeInTheDocument();
    // Check for the title in the drawer (second occurrence)
    expect(screen.getAllByText('Guardians of the Galaxy Vol. 2')[1]).toBeInTheDocument();
    // Check for the year in the drawer (second occurrence)
    expect(screen.getAllByText('2017')[1]).toBeInTheDocument();
    // Check for the runtime in the drawer (second occurrence)
    expect(screen.getAllByText('136 min')[1]).toBeInTheDocument();
  });

  it('closes drawer when close button is clicked', async () => {
    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[0] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOMDbData[1] }),
      });

    render(
      <DisplayMovieRecommendations recommendations={mockRecommendations} onBack={mockOnBack} />
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Guardians of the Galaxy Vol. 2')).toBeInTheDocument();
    });

    // Open drawer
    const firstMovieCard = screen
      .getAllByText('Guardians of the Galaxy Vol. 2')[0]
      .closest('.mantine-Card-root');
    fireEvent.click(firstMovieCard!);

    // Verify drawer is open
    expect(screen.getByText('Movie Details')).toBeInTheDocument();

    // Close drawer using the close button
    const closeButtons = screen.getAllByRole('button', { name: '' });
    const drawerCloseButton = closeButtons[0]; // First one is the X button
    fireEvent.click(drawerCloseButton);

    // Verify drawer is closed
    expect(screen.queryByText('Movie Details')).not.toBeInTheDocument();
  });
});
