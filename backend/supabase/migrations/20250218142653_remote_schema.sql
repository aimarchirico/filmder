alter table "public"."user_movies" add column "isLiked" boolean not null;

create policy "select authenticated"
on "public"."genres"
as permissive
for select
to authenticated
using (true);


create policy "select authenticated"
on "public"."movie_genres"
as permissive
for select
to authenticated
using (true);


create policy "authenticated all"
on "public"."user_movies"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



