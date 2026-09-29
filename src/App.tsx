import { IonApp, IonTabBar, IonTabButton, IonLabel, IonIcon, setupIonicReact } from '@ionic/react';
import { personOutline, cubeOutline, peopleOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import UsersPage from './presentation/users/UsersPage';
import ProductsPage from './presentation/products/ProductsPage';
import PersonsPage from './presentation/persons/PersonsPage';
import { databaseService } from './infrastructure/database/DatabaseService';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

type Tab = 'users' | 'products' | 'persons';

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('users');

  useEffect(() => {
    databaseService
      .initialize()
      .then(() => setReady(true))
      .catch((err) => setInitError((err as Error).message));
  }, []);

  if (initError) return <p style={{ padding: 16 }}>Error inicializando la base de datos: {initError}</p>;
  if (!ready) return <p style={{ padding: 16 }}>Cargando base de datos...</p>;

  return (
    <IonApp>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'users' && <UsersPage />}
          {activeTab === 'products' && <ProductsPage />}
          {activeTab === 'persons' && <PersonsPage />}
        </div>

        <IonTabBar slot="bottom">
          <IonTabButton tab="users" selected={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            <IonIcon icon={personOutline} />
            <IonLabel>Usuarios</IonLabel>
          </IonTabButton>
          <IonTabButton tab="products" selected={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            <IonIcon icon={cubeOutline} />
            <IonLabel>Productos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="persons" selected={activeTab === 'persons'} onClick={() => setActiveTab('persons')}>
            <IonIcon icon={peopleOutline} />
            <IonLabel>Personas</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </div>
    </IonApp>
  );
};

export default App;