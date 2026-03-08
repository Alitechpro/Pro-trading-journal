"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle"; // adjust path if needed
import { trades, userSettings } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── Auth helper ────────────────────────────────────────────────────────
async function getUserIdOrThrow() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// ── Settings ───────────────────────────────────────────────────────────
export async function getSettings() {
  const userId = await getUserIdOrThrow();

  let [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (!settings) {
    // Upsert default values
    [settings] = await db
      .insert(userSettings)
      .values({
        userId,
        initial: "10000",
        target: "100000",
      })
      .returning();
  }

  return settings;
}

export async function updateSettings(initial: string, target: string) {
  const userId = await getUserIdOrThrow();

  await db
    .update(userSettings)
    .set({
      initial,
      target,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId));

  revalidatePath("/");
}

// ── Trades ─────────────────────────────────────────────────────────────
export async function getTrades() {
  const userId = await getUserIdOrThrow();

  return db
    .select()
    .from(trades)
    .where(eq(trades.userId, userId))
    .orderBy(desc(trades.createdAt)); // most recent first (common in journals)
  // .orderBy(trades.date)   ← use this instead if you want chronological order
}

export async function addTrade(tradeData: {
  symbol: string;
  date: string;
  capitalRisked: string;
  quantity: string;
  entry: string;
  exit: string;
  pnlPercent: string;
  pnlDollar: string;
  fees: string;
}) {
  const userId = await getUserIdOrThrow();

  const [newTrade] = await db
    .insert(trades)
    .values({
      ...tradeData,
      userId,
    })
    .returning();

  revalidatePath("/");

  // Optional: return the created trade if the client needs the ID immediately
  return newTrade;
}

export async function deleteTrade(id: string) {
  const userId = await getUserIdOrThrow();

  const deleted = await db
    .delete(trades)
    .where(and(eq(trades.id, id), eq(trades.userId, userId)))
    .returning({ deletedId: trades.id });

  if (deleted.length === 0) {
    throw new Error("Trade not found or not owned by user");
  }

  revalidatePath("/");
}

export async function nukeData() {
  const userId = await getUserIdOrThrow();

  await db.transaction(async (tx) => {
    await tx.delete(trades).where(eq(trades.userId, userId));
    await tx.delete(userSettings).where(eq(userSettings.userId, userId));
  });

  revalidatePath("/");
}
