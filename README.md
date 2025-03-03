# Filmder

Filmder er en Tinder-inspirert filmapplikasjon. Med Filmder kan du enkelt oppdage og rangere filmer ved å sveipe høyre (like) eller venstre (dislike). Du kan også legge til venner og opprette filmkvelder hvor dere sammen kan finne filmer som alle liker. 

Besøk [filmder.no](https://filmder.no) for å prøve appen!


## Funksjoner

- 👆 Sveip for å like eller ikke like filmer
- 🎯 Filtrer filmer etter sjanger
- 👥 Legg til venner og sammenlign filmpreferanser
- 🎬 Se trailere og filmdetaljer
- 🌙 Opprett filmkvelder og finn filmer sammen med venner
- 👑 Admin-panel for innholdsstyring

## Kom i gang

### Live versjon
Appen er tilgjengelig på [filmder.no](https://filmder.no). Du kan enkelt registrere en bruker og begynne å bruke appen med en gang.

### Lokal utvikling

Hele kildekoden ligger i dette repoet slik at man enkelt kan starte en egen instans av appen. 

#### Forutsetninger
- Node.js v22
- En Supabase-konto
- En TMDB-konto

#### Installasjon

1. Installer avhengigheter både i [`backend`](backend) og [`frontend`](frontend):
```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Sett opp Supabase:
- Opprett et nytt Supabase prosjekt på [supabase.com](https://supabase.com)
- Logg inn på Supabase CLI og push databasen fra [`backend`](backend):
```bash
cd backend
npx supabase login
npx supabase link --project-ref <din-supabase-prosjekt-id>
npx supabase db push
npx supabase functions deploy
```

1. Sett opp miljøvariabler:
   
Opprett en `.env.local` fil i prosjektmappen med følgende innhold:
```
NEXT_PUBLIC_SUPABASE_URL=din_supabase_prosjekt_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din_supabase_anon_key
```

4. Start utviklingsserveren fra [`frontend`](frontend):
```bash
cd frontend
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren din.

## Teknologier

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Supabase
- **API**: TMDB (The Movie Database)
- **Auth**: Supabase Auth
- **Hosting**: Vercel

