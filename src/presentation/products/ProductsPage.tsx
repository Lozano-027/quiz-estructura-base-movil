import { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonList, IonText,
} from '@ionic/react';
import { RegisterProductUseCase } from '../../application/use-cases/RegisterProductUseCase';
import { SqliteProductRepository } from '../../infrastructure/database/repositories/SqliteProductRepository';
import type { Product } from '../../domain/entities/Product';

const productRepository = new SqliteProductRepository();
const registerProduct = new RegisterProductUseCase(productRepository);

const ProductsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => setProducts(await productRepository.findAll());

  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async () => {
    setError(null);
    try {
      await registerProduct.execute({
        name,
        price: Number(price),
        stock: Number(stock),
      });
      setName(''); setPrice(''); setStock('');
      await loadProducts();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>Productos</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={name} onIonChange={(e) => setName(e.detail.value ?? '')} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Precio</IonLabel>
          <IonInput type="number" value={price} onIonChange={(e) => setPrice(e.detail.value ?? '')} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Stock</IonLabel>
          <IonInput type="number" value={stock} onIonChange={(e) => setStock(e.detail.value ?? '')} />
        </IonItem>
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top">
          Registrar producto
        </IonButton>

        <IonList className="ion-margin-top">
          {products.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>{p.name} — ${p.price} — stock: {p.stock}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ProductsPage;
