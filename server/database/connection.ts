import { Database } from 'bun:sqlite'

export const db = new Database(process.env.DB_PATH || 'server/database/db.sqlite')

// Performance optimization PRAGMAs
export function initializeDatabase() {
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA synchronous = NORMAL;');
  db.run('PRAGMA cache_size = -64000;');
  db.run('PRAGMA foreign_keys = ON;');
  db.run('PRAGMA busy_timeout = 5000;');
  db.run('PRAGMA temp_store = MEMORY;');
  db.run('PRAGMA mmap_size = 268435456;');
}
