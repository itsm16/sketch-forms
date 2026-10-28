ALTER TABLE "forms" ADD COLUMN "theme" varchar(32) DEFAULT 'paper' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "success_animation" varchar(32) DEFAULT 'confetti' NOT NULL;