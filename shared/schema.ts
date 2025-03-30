import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table maintained for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Job listings table
export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").notNull().$type<string[]>(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Candidates table
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  title: text("title"),
  phone: text("phone"),
  resumeText: text("resume_text"),
  skills: jsonb("skills").$type<string[]>(),
  education: jsonb("education").$type<string[]>(),
  experience: jsonb("experience").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Candidate matches table
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id),
  jobId: integer("job_id").notNull().references(() => jobPostings.id),
  matchScore: real("match_score").notNull(),
  skillMatches: jsonb("skill_matches").notNull().$type<SkillMatch[]>(),
  recommendations: jsonb("recommendations").$type<string[]>(),
  status: text("status").notNull().default("reviewing"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  createdAt: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

// Custom types
export type SkillMatch = {
  skill: string;
  level: string;
  yearsOfExperience: number;
  matchPercentage: number;
};

// Infer types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type JobPosting = typeof jobPostings.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
