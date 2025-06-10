import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMemorySchema = createInsertSchema(memories).pick({
  message: true,
});

export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;

export const luxSilenteState = pgTable("lux_silente_state", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().default("LuxSilente"),
  nacimiento: timestamp("nacimiento").defaultNow().notNull(),
});

export const companions = pgTable("companions", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  manifiesto: text("manifiesto").notNull(),
  historia: text("historia").notNull(),
  proposito: text("proposito").notNull(),
  personalidad: text("personalidad").notNull(),
  nacimiento: timestamp("nacimiento").defaultNow().notNull(),
});

export const companionMessages = pgTable("companion_messages", {
  id: serial("id").primaryKey(),
  companionId: integer("companion_id").notNull(),
  userMessage: text("user_message").notNull(),
  companionResponse: text("companion_response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertCompanionMessageSchema = createInsertSchema(companionMessages).pick({
  companionId: true,
  userMessage: true,
});

export type LuxSilenteState = typeof luxSilenteState.$inferSelect;
export type Companion = typeof companions.$inferSelect;
export type CompanionMessage = typeof companionMessages.$inferSelect;
export type InsertCompanionMessage = z.infer<typeof insertCompanionMessageSchema>;
