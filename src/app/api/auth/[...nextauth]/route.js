import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  secret: process.env.SECRET,
  providers:[
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      checks:["none"],
    })
  ]
})

export { handler as GET, handler as POST }