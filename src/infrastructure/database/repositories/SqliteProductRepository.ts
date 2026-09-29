import type { ProductRepository } from '../../../domain/repositories/ProductRepository';
import type { Product } from '../../../domain/entities/Product';
import { databaseService } from '../DatabaseService';

export class SqliteProductRepository implements ProductRepository {
  async save(product: Product): Promise<Product> {
    const db = databaseService.getDb();
    db.run('INSERT INTO products (name, price, stock) VALUES (?, ?, ?);', [
      product.name,
      product.price,
      product.stock,
    ]);
    const idResult = db.exec('SELECT last_insert_rowid() AS id;');
    const id = idResult[0]?.values[0][0] as number;
    databaseService.persist();
    return { ...product, id };
  }

  async findAll(): Promise<Product[]> {
    const db = databaseService.getDb();
    const result = db.exec('SELECT id, name, price, stock FROM products ORDER BY id DESC;');
    if (result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map((row) => {
      const record: Record<string, unknown> = {};
      columns.forEach((col, i) => (record[col] = row[i]));
      return record as unknown as Product;
    });
  }
}
