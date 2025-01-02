import type { Handler } from "../types";

import { db } from "../drizzle/db";
import { definitions } from "../drizzle/schema";

const handler: Handler = async () => {
  return db.select().from(definitions);
};
export default handler;
