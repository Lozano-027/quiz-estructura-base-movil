import { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonList, IonText,
} from '@ionic/react';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { SqliteUserRepository } from '../../infrastructure/database/repositories/SqliteUserRepository';
import type { User } from '../../domain/entities/User';

const userRepository = new SqliteUserRepository();
const registerUser = new RegisterUserUseCase(userRepository);

const UsersPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => setUsers(await userRepository.findAll());

  useEffect(() => { loadUsers(); }, []);

  const handleSubmit = async () => {
    setError(null);
    try {
      await registerUser.execute({ name, email });
      setName('');
      setEmail('');
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>Usuarios</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={name} onIonChange={(e) => setName(e.detail.value ?? '')} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Correo</IonLabel>
          <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value ?? '')} />
        </IonItem>
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top">
          Registrar usuario
        </IonButton>

        <IonList className="ion-margin-top">
          {users.map((u) => (
            <IonItem key={u.id}>
              <IonLabel>{u.name} — {u.email}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UsersPage;
