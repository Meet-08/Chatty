import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/lib/reducer/authSlice";
import chatReducer from "@/lib/reducer/userChatSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
