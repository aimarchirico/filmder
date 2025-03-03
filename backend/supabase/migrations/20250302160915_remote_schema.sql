create table "public"."friends" (
    "sender_id" uuid not null,
    "receiver_id" uuid not null,
    "status" text default 'pending'::text
);


alter table "public"."friends" enable row level security;

create table "public"."mn_likes" (
    "mn_id" uuid not null,
    "movie_id" bigint not null,
    "user_id" uuid not null,
    "isLiked" boolean not null
);


alter table "public"."mn_likes" enable row level security;

create table "public"."mn_movies" (
    "mn_id" uuid not null,
    "movie_id" bigint not null
);


alter table "public"."mn_movies" enable row level security;

create table "public"."mn_users" (
    "mn_id" uuid not null,
    "user_id" uuid not null
);


alter table "public"."mn_users" enable row level security;

create table "public"."movie_night" (
    "id" uuid not null default gen_random_uuid(),
    "name" text
);


alter table "public"."movie_night" enable row level security;

alter table "public"."movies" add column "trailer_url" text;

CREATE UNIQUE INDEX friends_least_greatest_idx ON public.friends USING btree (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id));

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (sender_id, receiver_id);

CREATE INDEX friends_status_idx ON public.friends USING btree (status);

CREATE UNIQUE INDEX mn_likes_pkey ON public.mn_likes USING btree (mn_id, movie_id, user_id);

CREATE UNIQUE INDEX mn_movies_pkey ON public.mn_movies USING btree (mn_id, movie_id);

CREATE UNIQUE INDEX mn_users_pkey ON public.mn_users USING btree (mn_id, user_id);

CREATE UNIQUE INDEX movie_night_pkey ON public.movie_night USING btree (id);

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."mn_likes" add constraint "mn_likes_pkey" PRIMARY KEY using index "mn_likes_pkey";

alter table "public"."mn_movies" add constraint "mn_movies_pkey" PRIMARY KEY using index "mn_movies_pkey";

alter table "public"."mn_users" add constraint "mn_users_pkey" PRIMARY KEY using index "mn_users_pkey";

alter table "public"."movie_night" add constraint "movie_night_pkey" PRIMARY KEY using index "movie_night_pkey";

alter table "public"."friends" add constraint "friends_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_receiver_id_fkey";

alter table "public"."friends" add constraint "friends_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_sender_id_fkey";

alter table "public"."friends" add constraint "friends_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text]))) not valid;

alter table "public"."friends" validate constraint "friends_status_check";

alter table "public"."mn_likes" add constraint "mn_likes_mn_id_fkey" FOREIGN KEY (mn_id) REFERENCES movie_night(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mn_likes" validate constraint "mn_likes_mn_id_fkey";

alter table "public"."mn_likes" add constraint "mn_likes_movie_id_fkey" FOREIGN KEY (movie_id) REFERENCES movies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mn_likes" validate constraint "mn_likes_movie_id_fkey";

alter table "public"."mn_likes" add constraint "mn_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mn_likes" validate constraint "mn_likes_user_id_fkey";

alter table "public"."mn_movies" add constraint "mn_movies_mn_id_fkey" FOREIGN KEY (mn_id) REFERENCES movie_night(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mn_movies" validate constraint "mn_movies_mn_id_fkey";

alter table "public"."mn_movies" add constraint "mn_movies_movie_id_fkey" FOREIGN KEY (movie_id) REFERENCES movies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mn_movies" validate constraint "mn_movies_movie_id_fkey";

alter table "public"."mn_users" add constraint "mn_users_mn_id_fkey" FOREIGN KEY (mn_id) REFERENCES movie_night(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mn_users" validate constraint "mn_users_mn_id_fkey";

alter table "public"."mn_users" add constraint "mn_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mn_users" validate constraint "mn_users_user_id_fkey";

grant delete on table "public"."friends" to "anon";

grant insert on table "public"."friends" to "anon";

grant references on table "public"."friends" to "anon";

grant select on table "public"."friends" to "anon";

grant trigger on table "public"."friends" to "anon";

grant truncate on table "public"."friends" to "anon";

grant update on table "public"."friends" to "anon";

grant delete on table "public"."friends" to "authenticated";

grant insert on table "public"."friends" to "authenticated";

grant references on table "public"."friends" to "authenticated";

grant select on table "public"."friends" to "authenticated";

grant trigger on table "public"."friends" to "authenticated";

grant truncate on table "public"."friends" to "authenticated";

grant update on table "public"."friends" to "authenticated";

grant delete on table "public"."friends" to "service_role";

grant insert on table "public"."friends" to "service_role";

grant references on table "public"."friends" to "service_role";

grant select on table "public"."friends" to "service_role";

grant trigger on table "public"."friends" to "service_role";

grant truncate on table "public"."friends" to "service_role";

grant update on table "public"."friends" to "service_role";

grant delete on table "public"."mn_likes" to "anon";

grant insert on table "public"."mn_likes" to "anon";

grant references on table "public"."mn_likes" to "anon";

grant select on table "public"."mn_likes" to "anon";

grant trigger on table "public"."mn_likes" to "anon";

grant truncate on table "public"."mn_likes" to "anon";

grant update on table "public"."mn_likes" to "anon";

grant delete on table "public"."mn_likes" to "authenticated";

grant insert on table "public"."mn_likes" to "authenticated";

grant references on table "public"."mn_likes" to "authenticated";

grant select on table "public"."mn_likes" to "authenticated";

grant trigger on table "public"."mn_likes" to "authenticated";

grant truncate on table "public"."mn_likes" to "authenticated";

grant update on table "public"."mn_likes" to "authenticated";

grant delete on table "public"."mn_likes" to "service_role";

grant insert on table "public"."mn_likes" to "service_role";

grant references on table "public"."mn_likes" to "service_role";

grant select on table "public"."mn_likes" to "service_role";

grant trigger on table "public"."mn_likes" to "service_role";

grant truncate on table "public"."mn_likes" to "service_role";

grant update on table "public"."mn_likes" to "service_role";

grant delete on table "public"."mn_movies" to "anon";

grant insert on table "public"."mn_movies" to "anon";

grant references on table "public"."mn_movies" to "anon";

grant select on table "public"."mn_movies" to "anon";

grant trigger on table "public"."mn_movies" to "anon";

grant truncate on table "public"."mn_movies" to "anon";

grant update on table "public"."mn_movies" to "anon";

grant delete on table "public"."mn_movies" to "authenticated";

grant insert on table "public"."mn_movies" to "authenticated";

grant references on table "public"."mn_movies" to "authenticated";

grant select on table "public"."mn_movies" to "authenticated";

grant trigger on table "public"."mn_movies" to "authenticated";

grant truncate on table "public"."mn_movies" to "authenticated";

grant update on table "public"."mn_movies" to "authenticated";

grant delete on table "public"."mn_movies" to "service_role";

grant insert on table "public"."mn_movies" to "service_role";

grant references on table "public"."mn_movies" to "service_role";

grant select on table "public"."mn_movies" to "service_role";

grant trigger on table "public"."mn_movies" to "service_role";

grant truncate on table "public"."mn_movies" to "service_role";

grant update on table "public"."mn_movies" to "service_role";

grant delete on table "public"."mn_users" to "anon";

grant insert on table "public"."mn_users" to "anon";

grant references on table "public"."mn_users" to "anon";

grant select on table "public"."mn_users" to "anon";

grant trigger on table "public"."mn_users" to "anon";

grant truncate on table "public"."mn_users" to "anon";

grant update on table "public"."mn_users" to "anon";

grant delete on table "public"."mn_users" to "authenticated";

grant insert on table "public"."mn_users" to "authenticated";

grant references on table "public"."mn_users" to "authenticated";

grant select on table "public"."mn_users" to "authenticated";

grant trigger on table "public"."mn_users" to "authenticated";

grant truncate on table "public"."mn_users" to "authenticated";

grant update on table "public"."mn_users" to "authenticated";

grant delete on table "public"."mn_users" to "service_role";

grant insert on table "public"."mn_users" to "service_role";

grant references on table "public"."mn_users" to "service_role";

grant select on table "public"."mn_users" to "service_role";

grant trigger on table "public"."mn_users" to "service_role";

grant truncate on table "public"."mn_users" to "service_role";

grant update on table "public"."mn_users" to "service_role";

grant delete on table "public"."movie_night" to "anon";

grant insert on table "public"."movie_night" to "anon";

grant references on table "public"."movie_night" to "anon";

grant select on table "public"."movie_night" to "anon";

grant trigger on table "public"."movie_night" to "anon";

grant truncate on table "public"."movie_night" to "anon";

grant update on table "public"."movie_night" to "anon";

grant delete on table "public"."movie_night" to "authenticated";

grant insert on table "public"."movie_night" to "authenticated";

grant references on table "public"."movie_night" to "authenticated";

grant select on table "public"."movie_night" to "authenticated";

grant trigger on table "public"."movie_night" to "authenticated";

grant truncate on table "public"."movie_night" to "authenticated";

grant update on table "public"."movie_night" to "authenticated";

grant delete on table "public"."movie_night" to "service_role";

grant insert on table "public"."movie_night" to "service_role";

grant references on table "public"."movie_night" to "service_role";

grant select on table "public"."movie_night" to "service_role";

grant trigger on table "public"."movie_night" to "service_role";

grant truncate on table "public"."movie_night" to "service_role";

grant update on table "public"."movie_night" to "service_role";

create policy "authenticated all"
on "public"."friends"
as permissive
for all
to authenticated
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));


create policy "anon all"
on "public"."movies"
as permissive
for select
to anon
using (true);



