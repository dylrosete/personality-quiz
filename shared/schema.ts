import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const personalityProfiles = pgTable("personality_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mbtiType: varchar("mbti_type", { length: 4 }).notNull(),
  openness: integer("openness").notNull(),
  conscientiousness: integer("conscientiousness").notNull(),
  extraversion: integer("extraversion").notNull(),
  agreeableness: integer("agreeableness").notNull(),
  neuroticism: integer("neuroticism").notNull(),
  createdAt: varchar("created_at").default(sql`now()`),
});

export const insertPersonalityProfileSchema = createInsertSchema(personalityProfiles).omit({
  id: true,
  createdAt: true,
});

export type InsertPersonalityProfile = z.infer<typeof insertPersonalityProfileSchema>;
export type PersonalityProfile = typeof personalityProfiles.$inferSelect;

// MBTI Data Types
export interface MBTIData {
  title: string;
  animeCharacter: string;
  marvelCharacter: string;
  animeImage: string;
  marvelImage: string;
  books: string[];
  anime: string[];
  activities: string[];
  videos: string[];
  lifestyle: string[];
  learning: string[];
}

export interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}
shared
