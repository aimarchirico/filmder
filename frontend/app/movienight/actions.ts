"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function createMovienight(formData: FormData) {
    const supabase = await createClient(); 

    const movieNightName = formData.get("movieNightName") as string;
    const selectedFriends = formData.getAll("selectedFriends") as string[];
    const movieCount = formData.get("movieCount") as string;
    const selectedGenres = formData.getAll("selectedGenres") as string[];

    if (!movieNightName || !selectedFriends || !movieCount || !selectedGenres) {
        return { error: "All fields are required", success: null };
    }

    const movieNightId = uuidv4();

    const { error: movieNightError } = await supabase.from("movie_nights").insert([
        {
            id: movieNightId,
            name: movieNightName,
            movie_count: parseInt(movieCount),
        },
    ]);

    if (movieNightError) {
        return { error: movieNightError.message, success: null };
    }

    const genreInserts = selectedGenres.map((genre) => ({
        movie_night_id: movieNightId,
        genre_name: genre,
    }));

    const { error: genreError } = await supabase.from("movie_night_genres").insert(genreInserts);

    if (genreError) {
        return { error: genreError.message, success: null };
    }

    const friendInserts = selectedFriends.map((friend) => ({
        movie_night_id: movieNightId,
        friend_email: friend,
    }));

    const { error: friendError } = await supabase.from("movie_night_friends").insert(friendInserts);

    if (friendError) {
        return { error: friendError.message, success: null };
    }

    return { error: null, success: "Movie night created successfully!" };
}