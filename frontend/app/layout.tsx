import './globals.css'

export const metadata = {
  title: 'Filmder',
  description: 'Filmder web app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Added static links for SEO */}
        <noscript>
          <div>
            <a href="/">Filmder</a>
            <a href="/home">Home</a>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
            <a href="/explore">Explore</a>
            <a href="/movies">My Movies</a>
            <a href="/friends">Friends</a>
            <a href="/profile">Profile</a>
          </div>
        </noscript>
      </body>
    </html>
  )
}
