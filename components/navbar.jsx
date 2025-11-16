import { auth, signOut } from "@/app/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-black border-b border-gray-600 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="bg-white px-6 py-2.5 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-black/10"
            >
              Sadaf Auth
            </Link>
            {session && (
              <Link 
                href="/main" 
                className="text-slate-300 hover:text-white font-semibold transition-all duration-200 hover:bg-slate-600/50 px-4 py-2 rounded-lg border border-transparent hover:border-cyan-500/30"
              >
                Users Directory
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-4 bg-slate-700/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-600">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-10 h-10 rounded-full border-2 border-cyan-500 shadow-lg"
                    />
                  )}
                  <span className="text-slate-200 font-semibold hidden md:block text-sm">
                    {session.user?.name || "User"}
                  </span>
                  <form
                    action={async () => {
                      "use server"
                      await signOut({ redirect: false })
                      redirect("/")
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-red-500"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <Link
                href="/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
