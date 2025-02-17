import { Movie } from "@/types/Movies";
import { createClient } from "@/utils/supabase/client";

const useMovies = () => {
  const supabase: any = createClient();

  // get logged in user
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  // fetch genres
  const fetchGenres = async () => {
    const { data } = await supabase.from("genres").select("*").order("name");
    return data;
  };
 // fetch next movie
  const fetchNextMovie = async (genres: number[], excludeId?: number): Promise<Movie | null> => {
    const user = await getUser();
    if (!user) return null;

    // already rated
    const { data: ratedMovies } = await supabase
      .from("user_movies")
      .select("movie_id")
      .eq("user_id", user.id);
    const ratedMovieIds = ratedMovies?.map((rm: { movie_id: number }) => rm.movie_id) || [];

    // exclude already rated + current movie
    const excludeIds = [...ratedMovieIds];
    if (excludeId && !excludeIds.includes(excludeId)) {
      excludeIds.push(excludeId);
    }

    // if no genres are passed, use favorite genres
    let filteredGenres = genres;
    if (genres.length === 0) {
      const favoriteGenres = await fetchFavoriteGenres();
      if (favoriteGenres.length > 0) {
        filteredGenres = favoriteGenres;
      }
    } 

    // build query
    let query = supabase.from("movies").select(`
      id,
      name,
      image_url,
      rating,
      movie_genres!inner(genre_id)
    `);

    if (excludeIds.length > 0) {
      query = query.not("id", "in", `(${excludeIds.join(",")})`);
    }

    if (filteredGenres.length > 0) {
      query = query.in("movie_genres.genre_id", filteredGenres);
    }

    query = query.order("rating", { ascending: false }).limit(1).single();

    const { data: movie, error } = await query;
    if (error) {
      console.error("Error fetching movie:", error);
      return null;
    }
    return {
      id: movie.id,
      name: movie.name,
      image_url: movie.image_url,
    };
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


  return {
    fetchGenres,
    fetchNextMovie,
    rateMovie
  };
};

export default useMovies;
