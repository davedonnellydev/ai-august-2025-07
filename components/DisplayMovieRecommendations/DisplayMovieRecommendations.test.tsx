import { fireEvent, render, screen } from '../../test-utils';
import { DisplayMovieRecommendations } from './DisplayMovieRecommendations';

describe('DisplayMovieRecommendations', () => {
  it('renders the movie recommendations header', () => {
    render(<DisplayMovieRecommendations />);

    expect(screen.getByText('🎬 Movie Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Here are your personalized movie suggestions')).toBeInTheDocument();
    expect(screen.getByText('5 Movies')).toBeInTheDocument();
  });

  it('displays all mock movies in the grid', () => {
    render(<DisplayMovieRecommendations />);

    expect(screen.getByText('Guardians of the Galaxy Vol. 2')).toBeInTheDocument();
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Pulp Fiction')).toBeInTheDocument();
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
  });

  it('shows movie details when a movie card is clicked', () => {
    render(<DisplayMovieRecommendations />);

    // Click on the first movie card (use the first occurrence)
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
    expect(screen.getByText('7.6/10')).toBeInTheDocument();
    // Check for the runtime in the drawer (second occurrence)
    expect(screen.getAllByText('136 min')[1]).toBeInTheDocument();
  });

  it('shows movie details when view details button is clicked', () => {
    render(<DisplayMovieRecommendations />);

    // Click on the first view details button
    const viewDetailsButtons = screen.getAllByText('View Details');
    fireEvent.click(viewDetailsButtons[0]);

    // Check if drawer opens with movie details
    expect(screen.getByText('Movie Details')).toBeInTheDocument();
  });

  it('displays movie genres as badges', () => {
    render(<DisplayMovieRecommendations />);

    // Check for specific genres in the first movie card
    const firstMovieCard = screen
      .getAllByText('Guardians of the Galaxy Vol. 2')[0]
      .closest('.mantine-Card-root');
    expect(firstMovieCard).toBeInTheDocument();

    // Check that the first movie shows only the first 2 genres (Action, Adventure)
    // Note: The component only shows first 2 genres in cards: movie.genre.slice(0, 2)
    expect(firstMovieCard).toHaveTextContent('Action');
    expect(firstMovieCard).toHaveTextContent('Adventure');
    // Comedy is not shown in the card (only in drawer)
    expect(firstMovieCard).not.toHaveTextContent('Comedy');
  });

  it('shows movie ratings and runtime', () => {
    render(<DisplayMovieRecommendations />);

    // Check for ratings and runtime in the first movie
    expect(screen.getByText('7.6')).toBeInTheDocument();
    expect(screen.getByText('136 min')).toBeInTheDocument();

    // Check for ratings and runtime in the second movie (The Dark Knight)
    // Just check if the text exists somewhere in the document
    expect(screen.getByText('152 min')).toBeInTheDocument();

    // Check that we have multiple movies with different ratings
    const ratingElements = screen.getAllByText(/^\d+\.\d+$/);
    expect(ratingElements.length).toBeGreaterThan(1);
  });

  it('closes drawer when close button is clicked', () => {
    render(<DisplayMovieRecommendations />);

    // Open drawer
    const firstMovieCard = screen
      .getAllByText('Guardians of the Galaxy Vol. 2')[0]
      .closest('.mantine-Card-root');
    fireEvent.click(firstMovieCard!);

    // Verify drawer is open
    expect(screen.getByText('Movie Details')).toBeInTheDocument();

    // Close drawer using the first close button (the X in the drawer header)
    const closeButtons = screen.getAllByRole('button', { name: '' });
    const drawerCloseButton = closeButtons[0]; // First one is the X button
    fireEvent.click(drawerCloseButton);

    // Verify drawer is closed
    expect(screen.queryByText('Movie Details')).not.toBeInTheDocument();
  });
});
