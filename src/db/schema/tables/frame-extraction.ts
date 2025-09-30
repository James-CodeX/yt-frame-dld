import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { user } from "./user";

export const frameExtraction = pgTable("frame_extraction", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  youtubeUrl: text("youtube_url").notNull(),
  videoTitle: text("video_title"),
  videoThumbnail: text("video_thumbnail"),
  timestamp: text("timestamp").notNull(),
  frameUrl: text("frame_url").notNull(),
  quality: text("quality").notNull(), // "UHD" or "HD"
  fileSizeBytes: integer("file_size_bytes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FrameExtractionType = typeof frameExtraction.$inferSelect;
export type InsertFrameExtractionType = typeof frameExtraction.$inferInsert;