// src/app/sign-in/page.tsx

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h1>
        <p className="text-gray-300 text-center mb-8">
          Sign in to continue to <span className="font-semibold text-indigo-400">OpenPulse</span>
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-md"
          >
            Sign In
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <a href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
