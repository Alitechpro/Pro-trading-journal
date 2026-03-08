// app/actions/trade.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
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
    // Create default settings
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

  const rows = await db
    .select()
    .from(trades)
    .where(eq(trades.userId, userId))
    .orderBy(desc(trades.createdAt)); // newest first

  // Convert numeric strings back to numbers
  return rows.map((row) => ({
    id: row.id,
    symbol: row.symbol,
    date: row.date,
    capitalRisked: Number(row.capitalRisked),
    quantity: Number(row.quantity),
    entry: Number(row.entry),
    exit: Number(row.exit),
    pnlPercent: Number(row.pnlPercent),
    pnlDollar: Number(row.pnlDollar),
    fees: Number(row.fees),
  }));
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

  // Return with numbers instead of strings
  return {
    id: newTrade.id,
    symbol: newTrade.symbol,
    date: newTrade.date,
    capitalRisked: Number(newTrade.capitalRisked),
    quantity: Number(newTrade.quantity),
    entry: Number(newTrade.entry),
    exit: Number(newTrade.exit),
    pnlPercent: Number(newTrade.pnlPercent),
    pnlDollar: Number(newTrade.pnlDollar),
    fees: Number(newTrade.fees),
  };
}

export async function deleteTrade(id: string) {
  const userId = await getUserIdOrThrow();

  const deleted = await db
    .delete(trades)
    .where(and(eq(trades.id, id), eq(trades.userId, userId)))
    .returning({ deletedId: trades.id });

  if (deleted.length === 0) {
    return false; // not found or not owned
  }

  revalidatePath("/");
  return true;
}

export async function nukeData() {
  const userId = await getUserIdOrThrow();

  await db.transaction(async (tx) => {
    await tx.delete(trades).where(eq(trades.userId, userId));
    await tx.delete(userSettings).where(eq(userSettings.userId, userId));
  });

  revalidatePath("/");
}
