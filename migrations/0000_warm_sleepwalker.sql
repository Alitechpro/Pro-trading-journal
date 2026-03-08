CREATE TABLE "trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"symbol" text NOT NULL,
	"date" text NOT NULL,
	"capital_risked" numeric(12, 6) NOT NULL,
	"quantity" numeric(12, 6) NOT NULL,
	"entry" numeric(12, 6) NOT NULL,
	"exit" numeric(12, 6) NOT NULL,
	"pnl_percent" numeric(10, 4) NOT NULL,
	"pnl_dollar" numeric(12, 6) NOT NULL,
	"fees" numeric(12, 6) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"initial" numeric(12, 2) DEFAULT '10000' NOT NULL,
	"target" numeric(12, 2) DEFAULT '100000' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
