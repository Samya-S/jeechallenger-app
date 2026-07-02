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
    async jwt({ token, user, trigger }) {
      const client = await clientPromise;
      const db = client.db();
      const now = new Date();
      const todayString = now.toISOString().split('T')[0]; // Yields "YYYY-MM-DD"

      // --- INITIAL SIGN IN ---
      if (user) {
        token.id = user.id;
        token.created_at = user.created_at ? user.created_at.toISOString() : now.toISOString();
        
        const planId = user.subscription_plan_id;
        if (planId) {
          const queryId = typeof planId === 'string' ? new ObjectId(planId) : planId;
          const plan = await db.collection("subscription_plans").findOne({ _id: queryId });
          
          token.subscription_plan_id = planId.toString();
          token.plan_name = plan ? plan.name : "Starter";
          token.services = plan && plan.services ? plan.services : {};
        } else {
          token.subscription_plan_id = null;
          token.plan_name = "Starter";
          token.services = {};
        }
      } 
      // --- SUBSEQUENT REQUESTS (Verify user still exists) ---
      else if (token?.id) {
        const existingUser = await db.collection("users").findOne({ _id: new ObjectId(token.id) });
        
        if (!existingUser) {
          // User was deleted from the DB! Flag the token.
          token.error = "UserDeleted";
          return token; 
        }
      }

      // --- SESSION UPDATES (e.g., after Stripe payment) ---
      if (trigger === "update" && token.id) {
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

      // --- DAILY LOGIN TRACKER (The JWT Throttling Trick) ---
      // This logic runs for both new logins and returning sessions on a new day.
      // If the token's logged date doesn't match today, we hit the DB. Otherwise, we skip completely!
      if (token.id && !token.error && token.last_logged_date !== todayString) {
        
        // Use Promise.all to run both DB updates concurrently in the background
        await Promise.all([
          // 1. Maintain the `last_login` timestamp dynamically
          db.collection("users").updateOne(
            { _id: new ObjectId(token.id) },
            { $set: { last_login: now } }
          ),
          
          // 2. Upsert the daily log to calculate returning users accurately
          db.collection("login_logs").updateOne(
            { 
              user_id: new ObjectId(token.id), 
              date: todayString 
            },
            { 
              $setOnInsert: { 
                user_id: new ObjectId(token.id), 
                date: todayString, 
                timestamp: now 
              } 
            },
            { upsert: true }
          )
        ]).catch(err => console.error("Failed to update daily login tracker:", err));

        // Stamp the token with today's date so it doesn't trigger the DB again today
        token.last_logged_date = todayString;
      }

      return token;
    },
    
    async session({ session, token }) {
      // Pass the deletion error to the frontend
      if (token.error === "UserDeleted") {
        session.error = "UserDeleted";
        return session;
      }

      if (session.user) {
        session.user.id = token.id;
        session.user.subscription_plan_id = token.subscription_plan_id;
        session.user.created_at = token.created_at;
        session.user.plan_name = token.plan_name;
        session.user.services = token.services;
      }
      return session;
    }
  },

  events: {
    async signIn({ user }) {
      const client = await clientPromise;
      const db = client.db();
      
      // Every time a user successfully signs in explicitly, update their last_login in the background.
      await db.collection("users").updateOne(
        { _id: new ObjectId(user.id) },
        { $set: { last_login: new Date() } }
      );
    }
  },
  
  // Must perfectly match the NEXTAUTH_SECRET in your FastAPI .env config
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Export standard App Router handlers for both GET and POST
export { handler as GET, handler as POST };