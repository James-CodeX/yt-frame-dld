"use server";

import { db } from "@/db";
import { frameExtraction, InsertFrameExtractionType } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function saveFrameExtraction(data: InsertFrameExtractionType) {
  try {
    const [result] = await db
      .insert(frameExtraction)
      .values(data)
      .returning();
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to save frame extraction:", error);
    return { success: false, error: "Failed to save extraction history" };
  }
}

export async function getUserFrameExtractions(userId: string, limit = 50) {
  try {
    const extractions = await db
      .select()
      .from(frameExtraction)
      .where(eq(frameExtraction.userId, userId))
      .orderBy(desc(frameExtraction.createdAt))
      .limit(limit);
    
    return { success: true, data: extractions };
  } catch (error) {
    console.error("Failed to get user frame extractions:", error);
    return { success: false, error: "Failed to retrieve extraction history" };
  }
}

export async function deleteFrameExtraction(id: string, userId: string) {
  try {
    const [deleted] = await db
      .delete(frameExtraction)
      .where(and(eq(frameExtraction.id, id), eq(frameExtraction.userId, userId)))
      .returning();
    
    if (!deleted) {
      return { success: false, error: "Extraction not found or unauthorized" };
    }
    
    return { success: true, data: deleted };
  } catch (error) {
    console.error("Failed to delete frame extraction:", error);
    return { success: false, error: "Failed to delete extraction" };
  }
}