import { render, screen } from '../../test-utils';
import { SelectMovieOptions } from './SelectMovieOptions';

// Mock the ClientRateLimiter since it's used in the parent component
jest.mock('../../app/lib/utils/api-helpers', () => ({
  ClientRateLimiter: {
    getRemainingRequests: jest.fn(() => 10),
  },
}));

describe('SelectMovieOptions', () => {
  it('renders the movie recommendations form', () => {
    render(<SelectMovieOptions />);

    // Check for description textarea
    expect(screen.getByLabelText(/What kind of movies are you looking for/)).toBeInTheDocument();

    // Check for genre selection by looking for the label text
    expect(screen.getByText('Genres')).toBeInTheDocument();

    // Check for category selection by looking for the label text
    expect(screen.getByText('Categories')).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /Recommend me some movies/ })).toBeInTheDocument();

    // Check for reset button
    expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
  });

  it('displays all available genres as chips', () => {
    render(<SelectMovieOptions />);

    // Check that some key genres are available as chips (rendered as checkboxes)
    expect(screen.getByRole('checkbox', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Comedy' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Drama' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Horror' })).toBeInTheDocument();
  });

  it('displays all available categories as chips', () => {
    render(<SelectMovieOptions />);

    // Check that some key categories are available as chips (rendered as checkboxes)
    expect(screen.getByRole('checkbox', { name: 'New Release' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Blockbuster' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Indie' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Award-Winning' })).toBeInTheDocument();
  });
});
