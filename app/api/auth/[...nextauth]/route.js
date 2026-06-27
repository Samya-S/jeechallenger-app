import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
    // 1. When a JWT is created or updated, inject the database IDs and dynamic services into the payload
    async jwt({ token, user, trigger }) {
      const client = await clientPromise;
      const db = client.db();

      // 'user' is only populated on initial sign-in/creation
      if (user) {
        let planId = user.subscription_plan_id;
        let plan = null;

        // If it's a new user or they have no plan, default to "Starter"
        if (!planId) {
          plan = await db.collection("subscription_plans").findOne({ name: "Starter" });
          
          if (plan) {
            planId = plan._id;
            // Persist the default plan to the user in the database
            await db.collection("users").updateOne(
              { _id: new ObjectId(user.id) },
              { $set: { subscription_plan_id: new ObjectId(planId) } }
            );
          }
        } else {
          // Fetch the existing plan
          const queryId = typeof planId === 'string' ? new ObjectId(planId) : planId;
          plan = await db.collection("subscription_plans").findOne({ _id: queryId });
        }

        token.id = user.id;
        token.subscription_plan_id = planId ? planId.toString() : null;
        token.created_at = user.created_at || new Date().toISOString();
        token.plan_name = plan ? plan.name : "Starter";

        // Grab the entire "services" object. This makes it future-proof for new microservices!
        token.services = plan && plan.services ? plan.services : {};
      }

      // Handle session updates (e.g., frontend calls update() after a successful Stripe payment)
      if (trigger === "update") {
        const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(token.id) });
        
        if (updatedUser && updatedUser.subscription_plan_id) {
          const planQueryId = typeof updatedUser.subscription_plan_id === 'string' 
            ? new ObjectId(updatedUser.subscription_plan_id) 
            : updatedUser.subscription_plan_id;
            
          const updatedPlan = await db.collection("subscription_plans").findOne({ _id: planQueryId });
          
          if (updatedPlan) {
            token.subscription_plan_id = updatedUser.subscription_plan_id.toString();
            token.plan_name = updatedPlan.name;
            token.services = updatedPlan.services || {};
          }
        }
      }

      return token;
    },
    
    // 2. Expose those IDs and services to frontend hooks (like useSession)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.subscription_plan_id = token.subscription_plan_id;
        session.user.created_at = token.created_at;
        session.user.plan_name = token.plan_name;
        // Expose the services object so the frontend knows what features to unlock
        session.user.services = token.services;
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