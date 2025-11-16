import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            // After successful sign in, redirect to /main
            // If coming from signin page or root, go to main
            if (url === `${baseUrl}/signin` || url === baseUrl || url === `${baseUrl}/`) {
                return `${baseUrl}/main`
            }
            // Allow relative URLs
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`
            }
            // Allow same origin URLs
            if (new URL(url).origin === baseUrl) {
                return url
            }
            // Default to main page
            return `${baseUrl}/main`
        },
    },
    trustHost: true, // Required for Vercel deployment
})