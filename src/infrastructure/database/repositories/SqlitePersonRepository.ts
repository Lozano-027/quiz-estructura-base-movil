import type { PersonRepository } from '../../../domain/repositories/PersonRepository';
import type { Person } from '../../../domain/entities/Person';
import { databaseService } from '../DatabaseService';

export class SqlitePersonRepository implements PersonRepository {
  async save(person: Person): Promise<Person> {
    const db = databaseService.getDb();
    db.run('INSERT INTO persons (first_name, last_name, document_id) VALUES (?, ?, ?);', [
      person.firstName,
      person.lastName,
      person.documentId,
    ]);
    const idResult = db.exec('SELECT last_insert_rowid() AS id;');
    const id = idResult[0]?.values[0][0] as number;
    databaseService.persist();
    return { ...person, id };
  }

  async findAll(): Promise<Person[]> {
    const db = databaseService.getDb();
    const result = db.exec(
      'SELECT id, first_name AS firstName, last_name AS lastName, document_id AS documentId FROM persons ORDER BY id DESC;'
    );
    if (result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map((row) => {
      const record: Record<string, unknown> = {};
      columns.forEach((col, i) => (record[col] = row[i]));
      return record as unknown as Person;
    });
  }
}
