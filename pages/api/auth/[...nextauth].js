import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {getCollection} from '../../../lib/mongodb'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 3 * 24 * 60 * 60, // 3 days
      },
    },
  },
  callbacks: {
    //eslint-disable-next-line no-unused-vars
    async signIn(user, account, profile) {
      // Connect to the database
      try {
        const collection = await getCollection('users');
        const existingUser = await collection.findOne({ email: user.user.email });
        if (!existingUser) {
          collection.insertOne(user.user);
        }
        console.log(existingUser)
      } catch (e) {
        console.log(e)
      }
      return user
    },
  },
  pages: {
    error: '/access-denied', // Use the custom error page
  },
}

export default NextAuth(authOptions)
