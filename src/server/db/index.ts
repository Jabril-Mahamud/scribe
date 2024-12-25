import { drizzle } from "drizzle-orm/vercel-postgres";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { sql } from "@vercel/postgres";




export const db = drizzle(sql, { schema });
