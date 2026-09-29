import type { User } from '../entities/User';

export interface UserRepository {
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
}
