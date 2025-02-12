export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  image_url: string;
  name: string;
  key?: number;
}

export interface MovieCardProps {
  currentMovie: Movie | null;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (identifier: string) => void;
  isLoading: boolean;
}

export interface GenreDropdownProps {
  isGenreDropdownOpen: boolean;
  setIsGenreDropdownOpen: React.Dispatch<boolean>;
  genres: Genre[];
  selectedGenres: number[];
  setSelectedGenres: React.Dispatch<number[]>;
}