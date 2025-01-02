import { pgTable, serial, text, varchar, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const definitions = pgTable("definitions", {
  id: serial("id").primaryKey(),
  word: varchar("word", { length: 255 }).unique(),
  definition: text("definition"),
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  token: uuid("token")
    .default(sql`gen_random_uuid()`)
    .unique(),
});
