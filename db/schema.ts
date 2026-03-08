import {
  pgTable,
  text,
  numeric,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

// ── Settings ────────────────────────────────────────────────────────────
export const userSettings = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(), // Clerk user.id
  initial: numeric("initial", { precision: 12, scale: 2 })
    .notNull()
    .default("10000"),
  target: numeric("target", { precision: 12, scale: 2 })
    .notNull()
    .default("100000"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ── Trades ──────────────────────────────────────────────────────────────
export const trades = pgTable(
  "trades",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(), // Clerk user.id
    symbol: text("symbol").notNull(),
    date: text("date").notNull(), // or: date("date").notNull() if you prefer pg date type
    capitalRisked: numeric("capital_risked", {
      precision: 12,
      scale: 6,
    }).notNull(),
    quantity: numeric("quantity", { precision: 12, scale: 6 }).notNull(),
    entry: numeric("entry", { precision: 12, scale: 6 }).notNull(),
    exit: numeric("exit", { precision: 12, scale: 6 }).notNull(),
    pnlPercent: numeric("pnl_percent", { precision: 10, scale: 4 }).notNull(),
    pnlDollar: numeric("pnl_dollar", { precision: 12, scale: 6 }).notNull(),
    fees: numeric("fees", { precision: 12, scale: 6 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("trades_user_id_idx").on(table.userId),
  })
);
