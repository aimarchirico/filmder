import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import HomePage from './page';

// Mock dependencies
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({})),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/hooks/User', () => ({
  __esModule: true,
  default: () => ({
    getUser: jest.fn().mockResolvedValue({ id: 'user123' }), // Default to authenticated user
  }),
}));

const mockMovies = [
  { id: 1, key: '1', title: 'Test Movie 1', poster_path: '/path1.jpg', overview: 'Overview 1' },
  { id: 2, key: '2', title: 'Test Movie 2', poster_path: '/path2.jpg', overview: 'Overview 2' },
];

const mockGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
];

jest.mock('@/hooks/Movies', () => ({
  __esModule: true,
  default: () => ({
    fetchGenres: jest.fn().mockResolvedValue(mockGenres),
    fetchMovieBatchLegacy: jest.fn().mockResolvedValue(mockMovies),
    rateMovie: jest.fn().mockResolvedValue({}),
  }),
}));

jest.mock('react-tinder-card', () => {
  return {
    __esModule: true,
    default: ({ children, onSwipe }: { children: React.ReactNode, onSwipe?: (direction: string) => void }) => (
      <div data-testid="tinder-card" onClick={() => onSwipe && onSwipe('right')}>
        {children}
      </div>
    ),
  };
});

jest.mock('@/components/Movies', () => ({
  GenreDropdown: ({ isGenreDropdownOpen, setIsGenreDropdownOpen, genres }: { 
    isGenreDropdownOpen: boolean; 
    setIsGenreDropdownOpen: (isOpen: boolean) => void; 
    genres: Array<{ id: number; name: string }> 
  }) => (
    <div data-testid="genre-dropdown">
      <button 
        data-testid="toggle-dropdown" 
        onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
      >
        Toggle
      </button>
      {isGenreDropdownOpen && 
        <ul>
          {genres.map(genre => (
            <li key={genre.id} data-testid={`genre-${genre.id}`}>{genre.name}</li>
          ))}
        </ul>
      }
    </div>
  ),
  MovieCard: ({ currentMovie, isLoading }: { 
    currentMovie?: { id: number; title: string; poster_path: string; overview: string };
    isLoading: boolean;
  }) => (
    <div data-testid="movie-card">
      {isLoading ? 'Loading...' : currentMovie?.title || 'No Movie'}
    </div>
  ),
}));

jest.mock('@/components/SplashScreen', () => ({
  __esModule: true,
  default: () => <div data-testid="splash-screen">Loading...</div>,
}));

jest.mock('@/components/PageContainer', () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div data-testid="page-container" data-title={title}>
      {children}
    </div>
  ),
}));

// Helper function for async rendering
const renderWithAct = async (component: any) => {
  let result;
  await act(async () => {
    result = render(component);
  });
  return result;
};

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render splash screen during authentication check', async () => {
    render(<HomePage />);
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
  });

  it('should render main content after authentication', async () => {
    await renderWithAct(<HomePage />);
    await waitFor(() => {
      expect(screen.getByTestId('page-container')).toBeInTheDocument();
      expect(screen.getByTestId('page-container')).toHaveAttribute('data-title', 'FILMDER');
    });
  });

  it('should display genre dropdown', async () => {
    await renderWithAct(<HomePage />);
    await waitFor(() => {
      expect(screen.getByTestId('genre-dropdown')).toBeInTheDocument();
    });
  });

  it('should toggle genre dropdown when clicked', async () => {
    await renderWithAct(<HomePage />);
    
    const toggleButton = await screen.findByTestId('toggle-dropdown');
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('genre-1')).toBeInTheDocument();
      expect(screen.getByTestId('genre-2')).toBeInTheDocument();
    });
  });

  it('should render movie cards when movies are loaded', async () => {
    await renderWithAct(<HomePage />);
    
    await waitFor(() => {
      const movieCards = screen.getAllByTestId('tinder-card');
      expect(movieCards.length).toBeGreaterThan(0);
    });
  });

  it('should have like and dislike buttons', async () => {
    await renderWithAct(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('page-container')).toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      // Two buttons: one for like, one for dislike, and one for genre dropdown toggle
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });

  // This test verifies the keyboard handler is added
  it('should handle keyboard events', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    await renderWithAct(<HomePage />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    

    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});