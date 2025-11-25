
import { io } from "socket.io-client";

export const socket = io("https://skillmatch-ai-2v8j.onrender.com", {
  transports: ["websocket", "polling"],
});
