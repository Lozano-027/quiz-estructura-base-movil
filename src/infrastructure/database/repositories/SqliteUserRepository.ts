import type { UserRepository } from '../../../domain/repositories/UserRepository';
import type { User } from '../../../domain/entities/User';
import { databaseService } from '../DatabaseService';

export class SqliteUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const db = databaseService.getDb();
    db.run('INSERT INTO users (name, email) VALUES (?, ?);', [user.name, user.email]);
    const idResult = db.exec('SELECT last_insert_rowid() AS id;');
    const id = idResult[0]?.values[0][0] as number;
    databaseService.persist();
    return { ...user, id };
  }

  async findAll(): Promise<User[]> {
    const db = databaseService.getDb();
    const result = db.exec('SELECT id, name, email FROM users ORDER BY id DESC;');
    if (result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map((row) => {
      const record: Record<string, unknown> = {};
      columns.forEach((col, i) => (record[col] = row[i]));
      return record as unknown as User;
    });
  }
}
