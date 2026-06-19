import { io } from "socket.io-client";
import { socketBaseUrl } from "./urls.js";

export const createSocket = () =>
  io(socketBaseUrl(), {
    auth: { token: localStorage.getItem("bidflow_token") },
    autoConnect: false
  });
