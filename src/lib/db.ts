import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL || 'file:local.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

export const db = createClient({
      url,
      authToken,
});

export async function initDb() {
      await db.execute(`
          CREATE TABLE IF NOT EXISTS webhooks (
                id TEXT PRIMARY KEY,
                      event TEXT NOT NULL,
                            payload TEXT NOT NULL,
                                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                                      )
                                        `);
}
