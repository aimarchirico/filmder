import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './page';
import useMovies from '../../hooks/Movies';
import useUser from '../../hooks/User';
import { createClient } from '../../utils/supabase/client';
import { Movie } from '../../types/Movies';

// Mock hooks and components used by HomePage
jest.mock('../../hooks/Movies');
jest.mock('../../hooks/User');
jest.mock('../../components/SplashScreen', () => {
  return jest.fn(() => <div data-testid="splash-screen">Loading...</div>);
});
jest.mock('../../utils/supabase/client');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('react-tinder-card', () => {
  return jest.fn(({ children }) => <div data-testid="tinder-card">{children}</div>);
});

describe('HomePage', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      name: 'Test Movie 1',
      image_url: '/test1.jpg',
      key: 1,
    },
    {
      id: 2,
      name: 'Test Movie 2',
      image_url: '/test2.jpg',
      key: 2,
    },
  ];

  // Setup mock implementations before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock async functions to resolve immediately
    (useMovies as jest.Mock).mockReturnValue({
      fetchGenres: jest.fn().mockResolvedValue([
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' }
      ]),
      fetchMovieBatch: jest.fn().mockResolvedValue(mockMovies),
      rateMovie: jest.fn().mockResolvedValue({}),
    });
    
    (useUser as jest.Mock).mockReturnValue({
      getUser: jest.fn().mockResolvedValue({ id: 'user-id' }),
    });
    
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: jest.fn().mockResolvedValue({}),
      },
    });
  });

  it('renders splash screen while checking auth', async () => {
    // Make sure getUser returns a pending promise initially
    const getUserMock = jest.fn().mockReturnValue(new Promise(resolve => {
      // Never resolve this promise during the test
      // This will keep the component in the loading state
    }));
    
    (useUser as jest.Mock).mockReturnValue({
      getUser: getUserMock,
    });
    
    render(<HomePage />);
    
    // Now the splash screen should be visible
    await waitFor(() => {
      expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
    });
  });

  it('renders movie cards after loading', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    
    // Verify the movie cards are rendered
    await waitFor(() => {
      const cards = screen.getAllByTestId('tinder-card');
      expect(cards.length).toBe(mockMovies.length);
    });
    
    // Check for movie titles
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('displays genre filter button', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    
    // Check for the genre filter button
    await waitFor(() => {
      const filterButton = screen.getByText(/Filter by genres/i);
      expect(filterButton).toBeInTheDocument();
    });
  });

  it('fetches movies on initial load', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    
    const { fetchMovieBatch } = useMovies();
    await waitFor(() => {
      expect(fetchMovieBatch).toHaveBeenCalledTimes(1);
    });
    
    // Check that the function was called with empty genres array (default)
    expect(fetchMovieBatch).toHaveBeenCalledWith([]);
  });
});