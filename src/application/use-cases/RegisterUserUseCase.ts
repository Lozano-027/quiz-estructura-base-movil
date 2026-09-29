import type { UserRepository } from '../../domain/repositories/UserRepository';
import type { User } from '../../domain/entities/User';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: { name: string; email: string }): Promise<User> {
    if (!input.name.trim()) {
      throw new Error('El nombre es obligatorio.');
    }
    if (!input.email.includes('@')) {
      throw new Error('El correo no es válido.');
    }
    return this.userRepository.save({ name: input.name.trim(), email: input.email.trim() });
  }
}
