export const movieBatchSize = 20 // breaks on mobile at around 25 causing glitching

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  image_url: string;
  name: string;
  description: string;
  year: number;
  trailer_url: string
  key?: number;
  rating: number;
}

export interface MovieCardProps {
  currentMovie?: Movie ;
  isLoading: boolean;
}

export interface SmallMovieCardProps {
  movie: Movie;
  showControls?: boolean;
  showLikeDislike?: boolean;
  removeOnAction?: boolean;
  onLike?: (movieId: number | string) => void;
  onDislike?: (movieId: number | string) => void;
  onRemove?: (movieId: number | string) => void;
  userRating?: string | null; 
  className?: string;
}

export interface GenreDropdownProps {
  isGenreDropdownOpen: boolean;
  setIsGenreDropdownOpen: React.Dispatch<boolean>;
  genres: Genre[];
  selectedGenres: number[];
  setSelectedGenres: React.Dispatch<number[]>;
}

export interface FetchMovieOptions {
  genres?: number[];
  excludeIds?: number[];
  limit?: number;
  useFavoriteGenres?: boolean;
  searchTerm?: string;
  includeRated?: boolean; 
}