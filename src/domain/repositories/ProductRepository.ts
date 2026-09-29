import type { Product } from '../entities/Product';

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
}
