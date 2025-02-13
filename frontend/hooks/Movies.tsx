import { Movie } from "@/types/Movies";
import { createClient } from "@/utils/supabase/client";

const useMovies = () => {
  const supabase: any = createClient();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  const fetchGenres = async () => {
    const { data } = await supabase.from("genres").select("*").order("name");
    return data;
  };

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

    if (genres.length > 0) {
      query = query.in("movie_genres.genre_id", genres);
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

  const rateMovie = async (movieId: number, isLiked: boolean) => {
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

  return {
    fetchGenres,
    fetchNextMovie,
    rateMovie,
  };
};

export default useMovies;
