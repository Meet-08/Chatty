import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { AppDispatch } from "./store";
import { connectWebSocket, disconnectWebSocket } from "./WebSocket";
import { login, signup, authCheck, logout } from "./reducer/authSlice";
import { User } from "@/interfaces/user";
import { RootState } from "./reducer/rootReducer";

export const listenerMiddleware = createListenerMiddleware<RootState>();

listenerMiddleware.startListening({
  matcher: isAnyOf(login.fulfilled, signup.fulfilled, authCheck.fulfilled),
  effect: async (action, listenerApi) => {
    const user = action.payload as User;

    const userId = user?._id;

    if (userId) {
      const dispatch = listenerApi.dispatch as AppDispatch;

      connectWebSocket(userId, dispatch);
    } else {
      const currentState = listenerApi.getState();
      if (action.type === authCheck.fulfilled.type && !currentState.auth.user) {
        disconnectWebSocket();
      }
    }
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(logout.fulfilled),
  effect: async () => {
    disconnectWebSocket();
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(authCheck.rejected),
  effect: async () => {
    disconnectWebSocket();
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(login.rejected, signup.rejected),
  effect: async () => {
    disconnectWebSocket();
  },
});
