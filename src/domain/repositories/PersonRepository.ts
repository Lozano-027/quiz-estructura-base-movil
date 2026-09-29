import type { Person } from '../entities/Person';

export interface PersonRepository {
  save(person: Person): Promise<Person>;
  findAll(): Promise<Person[]>;
}
