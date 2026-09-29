import initSqlJs, { Database } from 'sql.js';

const STORAGE_KEY = 'quiz_app_db_v1';

/**
 * Owns the single SQLite (sql.js / WebAssembly) database instance and its
 * schema. Everything else (repositories) asks THIS for the connection
 * instead of touching sql.js directly — one source of truth.
 *
 * Persistence: sql.js keeps the database in memory. We export its bytes and
 * save them to localStorage after every write, and reload them on startup,
 * so data survives a page reload.
 */
class DatabaseService {
  private db: Database | null = null;

  async initialize(): Promise<void> {
    const SQL = await initSqlJs({ locateFile: (file) => `/assets/${file}` });

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const binary = atob(saved);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      this.db = new SQL.Database(bytes);
    } else {
      this.db = new SQL.Database();
    }

    this.createSchema();
  }

  private createSchema(): void {
    this.getDb().run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        document_id TEXT NOT NULL UNIQUE
      );
    `);
    this.persist();
  }

  getDb(): Database {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() before using any repository.');
    }
    return this.db;
  }

  /** Saves the current in-memory database to localStorage so it survives a reload. */
  persist(): void {
    const bytes = this.getDb().export();
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    localStorage.setItem(STORAGE_KEY, btoa(binary));
  }
}

export const databaseService = new DatabaseService();
