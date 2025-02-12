drop policy "public can read countries" on "public"."countries";

revoke delete on table "public"."countries" from "anon";

revoke insert on table "public"."countries" from "anon";

revoke references on table "public"."countries" from "anon";

revoke select on table "public"."countries" from "anon";

revoke trigger on table "public"."countries" from "anon";

revoke truncate on table "public"."countries" from "anon";

revoke update on table "public"."countries" from "anon";

revoke delete on table "public"."countries" from "authenticated";

revoke insert on table "public"."countries" from "authenticated";

revoke references on table "public"."countries" from "authenticated";

revoke select on table "public"."countries" from "authenticated";

revoke trigger on table "public"."countries" from "authenticated";

revoke truncate on table "public"."countries" from "authenticated";

revoke update on table "public"."countries" from "authenticated";

revoke delete on table "public"."countries" from "service_role";

revoke insert on table "public"."countries" from "service_role";

revoke references on table "public"."countries" from "service_role";

revoke select on table "public"."countries" from "service_role";

revoke trigger on table "public"."countries" from "service_role";

revoke truncate on table "public"."countries" from "service_role";

revoke update on table "public"."countries" from "service_role";

alter table "public"."countries" drop constraint "countries_pkey";

drop index if exists "public"."countries_pkey";

drop table "public"."countries";

create table "public"."genres" (
    "id" bigint not null,
    "name" text not null
);


alter table "public"."genres" enable row level security;

create table "public"."movie_genres" (
    "movie_id" bigint not null,
    "genre_id" bigint not null
);


alter table "public"."movie_genres" enable row level security;

create table "public"."movies" (
    "id" bigint not null,
    "name" text not null,
    "year" smallint not null,
    "description" text not null,
    "image_url" text not null,
    "rating" real
);


alter table "public"."movies" enable row level security;

create table "public"."user_movies" (
    "user_id" uuid not null,
    "movie_id" bigint not null
);


alter table "public"."user_movies" enable row level security;

CREATE UNIQUE INDEX "Movies_pkey" ON public.movies USING btree (id);

CREATE UNIQUE INDEX genres_id_key ON public.genres USING btree (id);

CREATE UNIQUE INDEX genres_pkey ON public.genres USING btree (id);

CREATE UNIQUE INDEX movie_genres_pkey ON public.movie_genres USING btree (movie_id, genre_id);

CREATE UNIQUE INDEX movies_id_key ON public.movies USING btree (id);

CREATE UNIQUE INDEX user_movies_pkey ON public.user_movies USING btree (user_id, movie_id);

alter table "public"."genres" add constraint "genres_pkey" PRIMARY KEY using index "genres_pkey";

alter table "public"."movie_genres" add constraint "movie_genres_pkey" PRIMARY KEY using index "movie_genres_pkey";

alter table "public"."movies" add constraint "Movies_pkey" PRIMARY KEY using index "Movies_pkey";

alter table "public"."user_movies" add constraint "user_movies_pkey" PRIMARY KEY using index "user_movies_pkey";

alter table "public"."genres" add constraint "genres_id_key" UNIQUE using index "genres_id_key";

alter table "public"."movie_genres" add constraint "movie_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES genres(id) not valid;

alter table "public"."movie_genres" validate constraint "movie_genres_genre_id_fkey";

alter table "public"."movie_genres" add constraint "movie_genres_movie_id_fkey" FOREIGN KEY (movie_id) REFERENCES movies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."movie_genres" validate constraint "movie_genres_movie_id_fkey";

alter table "public"."movies" add constraint "movies_id_key" UNIQUE using index "movies_id_key";

alter table "public"."user_movies" add constraint "user_movies_movie_id_fkey" FOREIGN KEY (movie_id) REFERENCES movies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_movies" validate constraint "user_movies_movie_id_fkey";

alter table "public"."user_movies" add constraint "user_movies_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_movies" validate constraint "user_movies_user_id_fkey";

grant delete on table "public"."genres" to "anon";

grant insert on table "public"."genres" to "anon";

grant references on table "public"."genres" to "anon";

grant select on table "public"."genres" to "anon";

grant trigger on table "public"."genres" to "anon";

grant truncate on table "public"."genres" to "anon";

grant update on table "public"."genres" to "anon";

grant delete on table "public"."genres" to "authenticated";

grant insert on table "public"."genres" to "authenticated";

grant references on table "public"."genres" to "authenticated";

grant select on table "public"."genres" to "authenticated";

grant trigger on table "public"."genres" to "authenticated";

grant truncate on table "public"."genres" to "authenticated";

grant update on table "public"."genres" to "authenticated";

grant delete on table "public"."genres" to "service_role";

grant insert on table "public"."genres" to "service_role";

grant references on table "public"."genres" to "service_role";

grant select on table "public"."genres" to "service_role";

grant trigger on table "public"."genres" to "service_role";

grant truncate on table "public"."genres" to "service_role";

grant update on table "public"."genres" to "service_role";

grant delete on table "public"."movie_genres" to "anon";

grant insert on table "public"."movie_genres" to "anon";

grant references on table "public"."movie_genres" to "anon";

grant select on table "public"."movie_genres" to "anon";

grant trigger on table "public"."movie_genres" to "anon";

grant truncate on table "public"."movie_genres" to "anon";

grant update on table "public"."movie_genres" to "anon";

grant delete on table "public"."movie_genres" to "authenticated";

grant insert on table "public"."movie_genres" to "authenticated";

grant references on table "public"."movie_genres" to "authenticated";

grant select on table "public"."movie_genres" to "authenticated";

grant trigger on table "public"."movie_genres" to "authenticated";

grant truncate on table "public"."movie_genres" to "authenticated";

grant update on table "public"."movie_genres" to "authenticated";

grant delete on table "public"."movie_genres" to "service_role";

grant insert on table "public"."movie_genres" to "service_role";

grant references on table "public"."movie_genres" to "service_role";

grant select on table "public"."movie_genres" to "service_role";

grant trigger on table "public"."movie_genres" to "service_role";

grant truncate on table "public"."movie_genres" to "service_role";

grant update on table "public"."movie_genres" to "service_role";

grant delete on table "public"."movies" to "anon";

grant insert on table "public"."movies" to "anon";

grant references on table "public"."movies" to "anon";

grant select on table "public"."movies" to "anon";

grant trigger on table "public"."movies" to "anon";

grant truncate on table "public"."movies" to "anon";

grant update on table "public"."movies" to "anon";

grant delete on table "public"."movies" to "authenticated";

grant insert on table "public"."movies" to "authenticated";

grant references on table "public"."movies" to "authenticated";

grant select on table "public"."movies" to "authenticated";

grant trigger on table "public"."movies" to "authenticated";

grant truncate on table "public"."movies" to "authenticated";

grant update on table "public"."movies" to "authenticated";

grant delete on table "public"."movies" to "service_role";

grant insert on table "public"."movies" to "service_role";

grant references on table "public"."movies" to "service_role";

grant select on table "public"."movies" to "service_role";

grant trigger on table "public"."movies" to "service_role";

grant truncate on table "public"."movies" to "service_role";

grant update on table "public"."movies" to "service_role";

grant delete on table "public"."user_movies" to "anon";

grant insert on table "public"."user_movies" to "anon";

grant references on table "public"."user_movies" to "anon";

grant select on table "public"."user_movies" to "anon";

grant trigger on table "public"."user_movies" to "anon";

grant truncate on table "public"."user_movies" to "anon";

grant update on table "public"."user_movies" to "anon";

grant delete on table "public"."user_movies" to "authenticated";

grant insert on table "public"."user_movies" to "authenticated";

grant references on table "public"."user_movies" to "authenticated";

grant select on table "public"."user_movies" to "authenticated";

grant trigger on table "public"."user_movies" to "authenticated";

grant truncate on table "public"."user_movies" to "authenticated";

grant update on table "public"."user_movies" to "authenticated";

grant delete on table "public"."user_movies" to "service_role";

grant insert on table "public"."user_movies" to "service_role";

grant references on table "public"."user_movies" to "service_role";

grant select on table "public"."user_movies" to "service_role";

grant trigger on table "public"."user_movies" to "service_role";

grant truncate on table "public"."user_movies" to "service_role";

grant update on table "public"."user_movies" to "service_role";

create policy "genres allow all"
on "public"."genres"
as permissive
for all
to public
using (true);


create policy "movie_genres allow all"
on "public"."movie_genres"
as permissive
for all
to public
using (true);


create policy "movies allow all"
on "public"."movies"
as permissive
for all
to public
using (true);



