CREATE TYPE "public"."application_status" AS ENUM('applied', 'interviewing', 'offer', 'rejected');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(200) NOT NULL,
	"role" varchar(200) NOT NULL,
	"source" varchar(100),
	"status" "application_status" DEFAULT 'applied',
	"applied_date" timestamp DEFAULT now(),
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
