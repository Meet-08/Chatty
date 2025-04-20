import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { AppDispatch } from "./store";
import { Message } from "@/interfaces/message";
import { addMessage } from "./reducer/userChatSlice";

let stompClient: Client | null = null;
let subscription: StompSubscription | null = null;

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const SOCKJS_URL = `${BACKEND_URL}/ws`;

export const connectWebSocket = (userId: string, dispatch: AppDispatch) => {
  if (!userId) return;

  if (stompClient?.active) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKJS_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    subscribeToMessages(userId, dispatch);
  };

  stompClient.onStompError = (frame) => {
    console.error("STOMP Broker Error:", frame.headers["message"]);
    console.error("Error Details:", frame.body);
  };

  stompClient.onWebSocketError = (event) => {
    console.error("WebSocket transport error:", event);
  };

  stompClient.onDisconnect = () => {
    subscription = null;
  };

  stompClient.activate();
};

const subscribeToMessages = (userId: string, dispatch: AppDispatch) => {
  if (!stompClient?.connected) {
    console.error("Cannot subscribe: STOMP client not connected.");
    return;
  }

  if (subscription) {
    console.log("Already subscribed to messages.");
    return;
  }

  const userQueue = "/user/queue/messages";

  try {
    subscription = stompClient.subscribe(userQueue, (message: IMessage) => {
      try {
        console.log("Received raw message via WebSocket:", message.body);
        const receivedMessage: Message = JSON.parse(message.body);

        if (receivedMessage?.id && receivedMessage?.senderId) {
          dispatch(addMessage(receivedMessage));
        } else {
          console.warn(
            "Received invalid message format via WebSocket:",
            receivedMessage
          );
        }
      } catch (error) {
        console.error(
          "Failed to parse or process received WebSocket message:",
          error
        );
      }
    });
    console.log("Subscription to user queue successful.");
  } catch (error) {
    console.error("Failed to initiate subscription:", error);
    subscription = null;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient?.active) {
    console.log("Deactivating WebSocket client...");
    try {
      stompClient.deactivate();
    } catch (error) {
      console.error("Error during WebSocket deactivation:", error);
    }
  } else {
    console.log("WebSocket client is already inactive.");
  }

  stompClient = null;
  subscription = null;
};
