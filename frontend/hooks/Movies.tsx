import { Movie, movieBatchSize } from "@/types/Movies";
import { createClient } from "@/utils/supabase/client";
import useUser from "@/hooks/User"

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

  // fetch genres for these movies
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

  // fetch multiple movies
  const fetchMovieBatch = async (genres: number[], excludeIds: number[] = [], limit: number = movieBatchSize): Promise<Movie[]> => {
    const user = await getUser();
    if (!user) return [];

    // Get already rated movies
    const { data: ratedMovies } = await supabase
      .from("user_movies")
      .select("movie_id")
      .eq("user_id", user.id);
    const ratedMovieIds = ratedMovies?.map((rm: { movie_id: number }) => rm.movie_id) || [];

    // combine exclude IDs
    const allExcludeIds = [...new Set([...ratedMovieIds, ...excludeIds])];

    // if no genres provided, use favorite genres
    const genreFilter = genres.length > 0 ? genres : await fetchFavoriteGenres();

    // build query
    let query = supabase.from("movies").select(`
      id,
      name,
      image_url,
      rating,
      movie_genres!inner(genre_id)
    `);

    if (allExcludeIds.length > 0) {
      query = query.not("id", "in", `(${allExcludeIds.join(",")})`);
    }

    // Only apply genre filter if we have genres (either passed in or favorites)
    if (genreFilter.length > 0) {
      query = query.in("movie_genres.genre_id", genreFilter);
    }

    query = query.order("rating", { ascending: false }).limit(limit);

    const { data: movies, error } = await query;

    if (error) {
      console.error("Error fetching movies:", error);
      return [];
    }

    return movies.map((movie: any) => ({
      id: movie.id,
      name: movie.name,
      image_url: movie.image_url,
      key: `${movie.id}-${Date.now()}`
    }));
  };

  return {
    fetchGenres,
    fetchMovieBatch,
    rateMovie
  };
};

export default useMovies;
