import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  // Connect to your new decoupled Auth database
  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  // Enforce stateless JWTs so we can securely pass sessions to the AI microservice
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: '/ai-tutor',   // Send them here when they need to log in
    error: '/ai-tutor',    // Send them back here if Google throws an error
  },
  
  callbacks: {
    // 1. When a JWT is created or updated, inject the database IDs into the payload
    async jwt({ token, user }) {
      // 'user' is only populated on initial sign in/creation
      if (user) {
        token.id = user.id;
        token.subscription_plan_id = user.subscription_plan_id || null;
      }
      return token;
    },
    
    // 2. Expose those IDs to frontend hooks (like useSession) if needed
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.subscription_plan_id = token.subscription_plan_id;
      }
      return session;
    }
  },
  
  // Must perfectly match the NEXTAUTH_SECRET in your FastAPI .env config
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Export standard App Router handlers for both GET and POST
export { handler as GET, handler as POST };