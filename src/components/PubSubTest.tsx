import { useState } from "react";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
} from "@ionic/react";
import { PortalMessage, subscribe, publish } from "@ionic/portals";

interface SubscriptionMessage {
  id: number;
  date: string;
  portalMessage: {
    topic: string;
    data: any;
  };
}

interface Subscription {
  id: number;
  topic: string;
}

const PubSubTest = () => {
  const [publishTopic, setPublishTopic] = useState<string>("");
  const [publishData, setPublishData] = useState<string>("");
  const [subscribeTopic, setSubscribeTopic] = useState<string>("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionMessages, setSubscriptionMessages] = useState<
    SubscriptionMessage[]
  >([]);
  const [id, setId] = useState(0);

  const handlePublish = async () => {
    if (publishTopic) {
      const portalMessage: PortalMessage = {
        topic: publishTopic,
        data: publishData,
      };
      publish(portalMessage);

      setPublishTopic("");
      setPublishData("");
    }
  };

  const handleSubscribe = async () => {
    if (
      subscribeTopic &&
      !subscriptions.some(
        (subscription) => subscription.topic === subscribeTopic
      )
    ) {
      setSubscriptions((prevSubscriptions) => [
        { id: id, topic: subscribeTopic },
        ...prevSubscriptions,
      ]);
      setId((prevId) => prevId + 1);
      setSubscribeTopic("");

      await subscribe(subscribeTopic, (res) => {
        const date = new Date().toLocaleTimeString().split(" ")[0];
        const subscriptionMessage = { id: id, date, portalMessage: res };
        setId((prevId) => prevId + 1);
        setSubscriptionMessages((prevSubMessages) => [
          subscriptionMessage,
          ...prevSubMessages,
        ]);
      });
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonListHeader>
          <h3 style={{ fontWeight: 700 }}>Publish</h3>
        </IonListHeader>
        <IonList inset={true} lines="full">
          <IonItem>
            <IonInput
              label="Topic:"
              labelPlacement="floating"
              value={publishTopic}
              onIonInput={(e) => setPublishTopic(e.detail.value!)}
            />
            <IonInput
              label="Data:"
              labelPlacement="floating"
              value={publishData}
              onIonInput={(e) => {
                setPublishData(e.detail.value!);
              }}
            />
          </IonItem>
          <IonButton
            onClick={handlePublish}
            size="small"
            style={{ margin: 12 }}
            expand="block"
          >
            Publish
          </IonButton>
        </IonList>
        <IonListHeader>
          <h3 style={{ fontWeight: 700 }}>Subscribe</h3>
        </IonListHeader>
        <IonList inset={true} lines="full">
          <IonItem>
            <IonInput
              label="Topic:"
              labelPlacement="floating"
              value={subscribeTopic}
              onIonInput={(e) => setSubscribeTopic(e.detail.value!)}
            />
          </IonItem>
          <IonButton
            onClick={handleSubscribe}
            size="small"
            style={{ margin: 12 }}
            expand="block"
          >
            Subscribe
          </IonButton>
        </IonList>
        <IonAccordionGroup expand="inset">
          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>Subscriptions</IonLabel>
            </IonItem>
            <div slot="content">
              {subscriptions.map((subscription) => (
                <IonItem key={subscription.id}>
                  <IonLabel class="ion-text-wrap">
                    {subscription.topic}
                  </IonLabel>
                </IonItem>
              ))}
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>Subscription Messages</IonLabel>
            </IonItem>
            <div slot="content">
              {subscriptionMessages.map((message) => (
                <IonItem key={message.id}>
                  <IonLabel class="ion-text-wrap">
                    {message.date} | topic: {message.portalMessage.topic}, data:{" "}
                    {message.portalMessage.data}
                  </IonLabel>
                </IonItem>
              ))}
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default PubSubTest;
