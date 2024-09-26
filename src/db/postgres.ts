import postgres from "postgresjs";
import { env } from "../libs/env.ts";

/**
 * Establishes a connection to the PostgreSQL database using the environment variable-defined URL.
 *
 * @example
 * import sql from "./db/postgres.ts";
 *
 * async function query_data() {
 *   const result = await sql`SELECT * FROM users WHERE id = 1`;
 *   console.log(result);
 * }
 */
const sql: postgres.Sql = postgres(env.VAULT_DATABASE_URL);

export default sql;
