import React from 'react'
import { auth } from './auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect('/main')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-black">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-wide text-white drop-shadow-lg">
            Welcome to Sadaf Authentication App
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            Sign in with your preferred provider
          </p>
          <Link
            href="/signin"
            className="bg-white text-black px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-300 hover:border-gray-400"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
