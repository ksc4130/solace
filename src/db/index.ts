import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

const setup = (): Database | null => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return null;
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient, { schema });
  return db;
};

const db = setup();

export default db;
