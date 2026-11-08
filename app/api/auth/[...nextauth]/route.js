import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

function parseUserAgent(ua) {
  if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' };
  
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
  
  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  
  let browser = 'Unknown';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';
  
  return { browser, os, device };
}

function getClientIp(h) {
  if (!h) return 'Unknown';
  const cfIp = h.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const xForwarded = h.get('x-forwarded-for');
  if (xForwarded) {
    const firstIp = xForwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const xReal = h.get('x-real-ip');
  if (xReal) return xReal.trim();
  return 'Unknown';
}

function getClientLocation(h) {
  if (!h) return { city: null, country: null };
  const city = h.get('cf-ipcity') || h.get('x-vercel-ip-city') || null;
  const country = h.get('cf-ipcountry') || h.get('x-vercel-ip-country') || null;
  return { city, country };
}


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
    signIn: '/login',
    error: '/login',
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

      // --- DAILY DEVICE & IP LOGIN TRACKER ---
      // Runs when a user opens the app or returns on a new day or with a different device/IP.
      let reqHeaders = null;
      try {
        reqHeaders = await headers();
      } catch (err) {
        // Headers may not be available outside active request scope
      }

      const clientIp = getClientIp(reqHeaders);
      const { browser, os, device } = parseUserAgent(reqHeaders?.get('user-agent'));
      const { city, country } = getClientLocation(reqHeaders);
      const currentSignature = `${todayString}::${clientIp}::${device}::${browser}`;

      if (token.id && !token.error && token.last_login_signature !== currentSignature) {
        const logFilter = {
          user_id: new ObjectId(token.id),
          date: todayString,
          ip: clientIp,
          device,
        };

        const logDoc = {
          user_id: new ObjectId(token.id),
          date: todayString,
          timestamp: now,
          ip: clientIp,
          device,
          browser,
          os,
          city,
          country,
        };

        await Promise.all([
          // 1. Maintain the `last_login` timestamp dynamically
          db.collection("users").updateOne(
            { _id: new ObjectId(token.id) },
            { $set: { last_login: now } }
          ),
          
          // 2. Upsert the log for this user, date, IP, and device
          db.collection("login_logs").updateOne(
            logFilter,
            { $setOnInsert: logDoc },
            { upsert: true }
          )
        ]).catch(err => console.error("Failed to update daily login tracker:", err));

        token.last_login_signature = currentSignature;
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