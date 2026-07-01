import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// 1. Initialize the default adapter
const defaultAdapter = MongoDBAdapter(clientPromise);

// 2. Create a custom adapter by spreading the default one
const customAdapter = {
  ...defaultAdapter,
  createUser: async (user) => {
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch default starter plan
    const starterPlan = await db.collection("subscription_plans").findOne({ name: "Starter" });
    
    // Define the custom fields
    const initialData = {
      created_at: new Date(),
      last_login: new Date(),
      subscription_plan_id: starterPlan ? starterPlan._id : null,
      subscription_expiry: null,
      subscription_start_date: new Date(),
    };

    // Merge the NextAuth base user data with our custom fields BEFORE insertion
    const userWithInitialData = { ...user, ...initialData };

    // Let the default adapter handle the DB insertion with the merged data.
    // It will do it in a single operation and return the fully populated user.
    return await defaultAdapter.createUser(userWithInitialData);
  },
};

export const authOptions = {
  // Connect to your newly structured custom adapter
  adapter: customAdapter,
  
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
        token.id = user.id;
        token.created_at = user.created_at ? user.created_at.toISOString() : new Date().toISOString();
        
        const planId = user.subscription_plan_id;

        // Because of our createUser override, new users will already have a planId here
        if (planId) {
          const queryId = typeof planId === 'string' ? new ObjectId(planId) : planId;
          const plan = await db.collection("subscription_plans").findOne({ _id: queryId });
          
          token.subscription_plan_id = planId.toString();
          token.plan_name = plan ? plan.name : "Starter";
          token.services = plan && plan.services ? plan.services : {};
        } else {
          // Absolute fallback if no plan exists in the DB at all
          token.subscription_plan_id = null;
          token.plan_name = "Starter";
          token.services = {};
        }
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