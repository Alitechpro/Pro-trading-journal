// app/actions/nuke.ts
"use server";
import { db } from "@/db/drizzle"; // your Drizzle db instance (Neon driver)
import { trades, userSettings /* add all your tables */ } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function nukeAllData() {
  const user = await currentUser();

  // Security gates – adjust as needed
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Nuke only allowed in development");
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Optional: restrict to your own Clerk user ID (find in Clerk dashboard)
  if (user.id !== "user_35pyBgCbcVbuyWqL7HXfAuRuyFw") {
    throw new Error("Only dev admin can nuke");
  }

  try {
    // Delete in reverse dependency order to avoid FK violations
    // Adjust table names & order based on your actual schema

    await db.delete(trades); // or .where(eq(trades.userId, user.id)) for user-only
    await db.delete(userSettings);
    // ... delete from EVERY app table that stores user-generated data

    // Optional: if you also want to delete the Clerk user (careful!)
    // import { clerkClient } from "@clerk/nextjs/server";
    // await clerkClient.users.deleteUser(user.id);

    console.log("Database nuked successfully");
    return { success: true };
  } catch (error) {
    console.error("Nuke failed:", error);
    throw new Error("Failed to nuke data");
  }
}
