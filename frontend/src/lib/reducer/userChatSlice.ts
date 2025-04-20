import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Message } from "@/interfaces/message";
import { User } from "@/interfaces/user";
import axiosApi from "@/lib/axiosApi";
import toast from "react-hot-toast";

interface initialState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
}

const initialState: initialState = {
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
};

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get("/messages/users");
      return data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error);
    }
  }
);

export const getMessages = createAsyncThunk(
  "user/getMessages",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get(`/messages/${userId}`);
      return data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "user/sendMessage",
  async (message: FormData, { rejectWithValue, getState }) => {
    try {
      const senderId = (getState() as { chat: initialState }).chat.selectedUser
        ?._id;
      const { data } = await axiosApi.post(
        `/messages/send/${senderId}`,
        message
      );
      return data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    addMessage: (state, action) => {
      const newMessage = action.payload;

      const exists = state.messages.some((msg) => msg.id === newMessage.id);
      if (!exists) {
        state.messages.push(newMessage);

        state.messages.sort(
          (a, b) =>
            new Date(a.createdAt ?? 0).getTime() -
            new Date(b.createdAt ?? 0).getTime()
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.users = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isUserLoading = false;
        toast.error("Something went wrong");
      })
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
        toast.error("Something went wrong");
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const newMessage = action.payload;
        const exists = state.messages.some((msg) => msg.id === newMessage.id);
        if (!exists) {
          console.warn(
            "Message added via REST fulfillment (WS likely delayed):",
            newMessage.id
          );
          state.messages = [...state.messages, newMessage];
          state.messages.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
        }
      });
  },
});

export const { setSelectedUser, clearSelectedUser, addMessage } =
  userSlice.actions;
export default userSlice.reducer;
