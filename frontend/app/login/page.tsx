import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4">
      <form className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-semibold text-primary">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input id="email" name="email" type="email" required
            className="mt-1 w-full rounded border px-3 py-2 text-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary/50"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input id="password" name="password" type="password" required
            className="mt-1 w-full rounded border px-3 py-2 text-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary/50"
          />
        </div>

        <button formAction={login}
          className="mb-2 w-full rounded bg-primary px-4 py-2 text-white transition hover:bg-primary/80">
          Log in
        </button>

        <button formAction={signup}
          className="w-full rounded border border-primary px-4 py-2 text-primary transition hover:bg-primary hover:text-white">
          Sign up
        </button>
      </form>
    </div>
  )
}
