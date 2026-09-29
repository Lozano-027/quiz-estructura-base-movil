import { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonList, IonText,
} from '@ionic/react';
import { RegisterPersonUseCase } from '../../application/use-cases/RegisterPersonUseCase';
import { SqlitePersonRepository } from '../../infrastructure/database/repositories/SqlitePersonRepository';
import type { Person } from '../../domain/entities/Person';

const personRepository = new SqlitePersonRepository();
const registerPerson = new RegisterPersonUseCase(personRepository);

const PersonsPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [persons, setPersons] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadPersons = async () => setPersons(await personRepository.findAll());

  useEffect(() => { loadPersons(); }, []);

  const handleSubmit = async () => {
    setError(null);
    try {
      await registerPerson.execute({ firstName, lastName, documentId });
      setFirstName(''); setLastName(''); setDocumentId('');
      await loadPersons();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>Personas</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={firstName} onIonChange={(e) => setFirstName(e.detail.value ?? '')} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Apellido</IonLabel>
          <IonInput value={lastName} onIonChange={(e) => setLastName(e.detail.value ?? '')} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Documento</IonLabel>
          <IonInput value={documentId} onIonChange={(e) => setDocumentId(e.detail.value ?? '')} />
        </IonItem>
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top">
          Registrar persona
        </IonButton>

        <IonList className="ion-margin-top">
          {persons.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>{p.firstName} {p.lastName} — {p.documentId}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PersonsPage;
