import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import type { Product } from '../../domain/entities/Product';

export class RegisterProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: { name: string; price: number; stock: number }): Promise<Product> {
    if (!input.name.trim()) {
      throw new Error('El nombre del producto es obligatorio.');
    }
    if (input.price <= 0) {
      throw new Error('El precio debe ser mayor que cero.');
    }
    if (input.stock < 0) {
      throw new Error('El stock no puede ser negativo.');
    }
    return this.productRepository.save({
      name: input.name.trim(),
      price: input.price,
      stock: input.stock,
    });
  }
}
