CREATE TABLE "frame_extraction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"youtube_url" text NOT NULL,
	"video_title" text,
	"video_thumbnail" text,
	"timestamp" text NOT NULL,
	"frame_url" text NOT NULL,
	"quality" text NOT NULL,
	"file_size_bytes" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "frame_extraction" ADD CONSTRAINT "frame_extraction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;