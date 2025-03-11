import { Movie, movieBatchSize, FetchMovieOptions } from "@/types/Movies";
import { createClient } from "@/utils/supabase/client";
import useUser from "@/hooks/User";

const useMovies = () => {
  const supabase: any = createClient();
  const { getUser } = useUser(supabase);

  // fetch genres
  const fetchGenres = async () => {
    const { data } = await supabase.from("genres").select("*").order("name");
    return data;
  };

  const rateMovie = async (movieId: number, isLiked: boolean): Promise<void> => {
    const user = await getUser();
    if (!user || !movieId) return;

    // insert rating
    const { error } = await supabase
      .from("user_movies")
      .insert([{ user_id: user.id, movie_id: movieId, isLiked }]);

    if (error) {
      console.error("Error rating movie:", error);
      return;
    }
  };

  // fetch favorite genre ids based on liked movies
  const fetchFavoriteGenres = async (): Promise<number[]> => {
    const user = await getUser();
    if (!user) return [];

    // fetch movies the user liked
    const { data: likedMovies, error: likedMoviesError } = await supabase
      .from("user_movies")
      .select("movie_id")
      .eq("user_id", user.id)
      .eq("isLiked", true);

    if (likedMoviesError) {
      console.error("Error fetching liked movies:", likedMoviesError);
      return [];
    }

    const movieIds: number[] = likedMovies.map(
      (item: { movie_id: number }) => item.movie_id
    );
    if (movieIds.length === 0) return [];

    // fetch genres for the movies
    const { data: movieGenres, error: movieGenresError } = await supabase
      .from("movie_genres")
      .select("genre_id", { distinct: true })
      .in("movie_id", movieIds);

    if (movieGenresError) {
      console.error("Error fetching movie genres:", movieGenresError);
      return [];
    }

    const genreIds: number[] = movieGenres.map(
      (mg: { genre_id: number }) => mg.genre_id
    );

    return genreIds;
  };
 
  const fetchMovieBatch = async (options: FetchMovieOptions = {}): Promise<Movie[]> => {
    const {
      genres = [],
      excludeIds = [],
      limit = movieBatchSize,
      useFavoriteGenres = false,
      searchTerm = "",
      includeRated = false
    } = options;

    const user = await getUser();
    if (!user) return [];

    // Get already rated movies
    const { data: ratedMovies } = await supabase
      .from("user_movies")
      .select("movie_id")
      .eq("user_id", user.id);
    const ratedMovieIds = ratedMovies?.map((rm: { movie_id: number }) => rm.movie_id) || [];

    // exclude rated movies if includeRated is false
    const allExcludeIds = includeRated 
      ? [...new Set([...excludeIds])]  
      : [...new Set([...ratedMovieIds, ...excludeIds])];

    // fetch favorite genres if specified
    const genreFilter = genres.length > 0 ? genres : (useFavoriteGenres ? await fetchFavoriteGenres() : []);

    // build query
    let query = supabase.from("movies").select(`
      id,
      name,
      image_url,
      rating,
      description,
      year,
      trailer_url,
      movie_genres(genre_id)
    `);

    // Apply search filter if provided
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    if (allExcludeIds.length > 0) {
      query = query.not("id", "in", `(${allExcludeIds.join(",")})`);
    }

    // for explore/movies don't inner join if no genres selected
    if (genreFilter.length > 0) {
      query = supabase.from("movies")
        .select(`
          id,
          name,
          image_url,
          rating,
          description,
          year,
          trailer_url,
          movie_genres!inner(genre_id)
        `)
        .in("movie_genres.genre_id", genreFilter);
        
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      if (allExcludeIds.length > 0) {
        query = query.not("id", "in", `(${allExcludeIds.join(",")})`);
      }
    }

    query = query.order("rating", { ascending: false }).limit(limit);

    const { data: movies, error } = await query;

    if (error) {
      console.error("Error fetching movies:", error);
      return [];
    }

    return movies.map((movie: Movie) => ({
      id: movie.id,
      name: movie.name,
      image_url: movie.image_url,
      description: movie.description || "",
      year: movie.year || 0,
      trailer_url: movie.trailer_url || "",
      key: `${movie.id}-${Date.now()}`
    }));
  };

  // wrapper used for homepage
  const fetchMovieBatchLegacy = async (
    genres: number[] = [], 
    excludeIds: number[] = [], 
    limit: number = movieBatchSize
  ): Promise<Movie[]> => {
    return fetchMovieBatch({
      genres,
      excludeIds,
      limit,
      useFavoriteGenres: true 
    });
  };

  // fetch liked movies
  const fetchLikedMovies = async (): Promise<Movie[]> => {
    const user = await getUser();
    if (!user) return [];

    // Get user's liked movies
    const { data: likedMovies, error: likedError } = await supabase
      .from("user_movies")
      .select("movie_id")
      .eq("user_id", user.id)
      .eq("isLiked", true);

    if (likedError) {
      console.error("Error fetching liked movies:", likedError);
      return [];
    }

    if (!likedMovies.length) return [];

    // Get movie details
    const likedMovieIds: number[] = likedMovies.map((item: { movie_id: number }) => item.movie_id);
    
    const { data: movies, error } = await supabase
      .from("movies")
      .select(`
        id,
        name,
        image_url,
        rating,
        description,
        year,
        trailer_url
      `)
      .in("id", likedMovieIds);

    if (error) {
      console.error("Error fetching movie details:", error);
      return [];
    }

    return movies.map((movie: Movie) => ({
      id: movie.id,
      name: movie.name,
      image_url: movie.image_url,
      description: movie.description || "",
      year: movie.year || 0,
      trailer_url: movie.trailer_url || "",
      rating: movie.rating,
      key: `${movie.id}-${Date.now()}`
    }));
  };

  // Get rating for a movie
  const getUserMovieRating = async (movieId: number): Promise<string | null> => {
    const user = await getUser();
    if (!user || !movieId) return null;
  
    const { data, error } = await supabase
      .from("user_movies")
      .select("isLiked")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .single();
  
    if (error || !data) return null;
    return data.isLiked ? 'like' : 'dislike';
  };

  // get count of like movies
  const getLikedMoviesCount = async (): Promise<number> => {
    const user = await getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('user_movies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('isLiked', true);

    if (error) {
      console.error('Error getting liked movies count:', error);
      return 0;
    }

    return count || 0;
  };

  return {
    fetchGenres,
    fetchMovieBatch,
    fetchMovieBatchLegacy,
    fetchFavoriteGenres,
    fetchLikedMovies,
    rateMovie,
    getUserMovieRating,
    getLikedMoviesCount 
  };
};

export default useMovies;
