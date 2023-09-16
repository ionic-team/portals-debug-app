import {
  IonModal,
  IonContent,
  IonListHeader,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonItem,
  IonTextarea,
  IonLabel,
  IonList,
} from "@ionic/react";
import { useState } from "react";
import {
  chevronBack,
  alertCircleOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

interface CallMethodModalProps {
  showModal: boolean;
  pluginName: string;
  methodName: string;
  onCloseModal: () => void;
}

const CallMethodModal: React.FC<CallMethodModalProps> = ({
  showModal,
  pluginName,
  methodName,
  onCloseModal,
}) => {
  const [code, setCode] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCallMethod = async () => {
    setResult("");
    setError("");
    try {
      // @ts-ignore
      const res = await window.Capacitor.Plugins[pluginName][methodName](
        JSON.parse(code || '""')
      );
      setResult(JSON.stringify(res));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleCloseModal = () => {
    setCode("");
    setResult("");
    setError("");
    onCloseModal();
  };

  return (
    <IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButton onClick={handleCloseModal}>
              <IonIcon icon={chevronBack} />
              Back
            </IonButton>
          </IonButtons>
          <IonTitle>{methodName}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCallMethod}>Execute</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonListHeader>Argument:</IonListHeader>
        <IonList>
          <IonItem>
            <AceEditor
              height="200px"
              value={code}
              placeholder="Enter valid JSON here..."
              mode="json"
              theme="github"
              fontSize="13px"
              highlightActiveLine={true}
              onChange={(e) => setCode(e)}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
              }}
              style={{ marginTop: 10 }}
            />
          </IonItem>
          <IonButton
            expand="block"
            onClick={handleCallMethod}
            size="small"
            style={{ padding: 10 }}
          >
            Execute {methodName}
          </IonButton>
        </IonList>
        <IonListHeader>Result:</IonListHeader>
        <IonList lines="inset">
          {error && (
            <IonItem color="light">
              <IonIcon icon={alertCircleOutline} slot="start" color="danger" />
              <IonLabel color="danger" class="ion-text-wrap">
                {error}
              </IonLabel>
            </IonItem>
          )}
          {result && (
            <IonItem color="light">
              <IonIcon
                icon={checkmarkCircleOutline}
                color="success"
                slot="start"
              />
              <IonLabel class="ion-text-wrap">{result}</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default CallMethodModal;
