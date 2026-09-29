import type { PersonRepository } from '../../domain/repositories/PersonRepository';
import type { Person } from '../../domain/entities/Person';

export class RegisterPersonUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(input: { firstName: string; lastName: string; documentId: string }): Promise<Person> {
    if (!input.firstName.trim() || !input.lastName.trim()) {
      throw new Error('Nombre y apellido son obligatorios.');
    }
    if (!input.documentId.trim()) {
      throw new Error('El documento es obligatorio.');
    }
    return this.personRepository.save({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      documentId: input.documentId.trim(),
    });
  }
}
