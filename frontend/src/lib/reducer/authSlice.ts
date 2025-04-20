import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/interfaces/user";
import axiosFetch from "@/lib/axiosApi";
import toast from "react-hot-toast";
import axios from "axios";

type initialState = {
  user: User | null;
  error: Error | null;
  loading: boolean;
};

const initialState: initialState = {
  user: null,
  error: null,
  loading: false,
};

export const authCheck = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosFetch.get("/auth/check");
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosFetch.post("/auth/login", user);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (user: User, { rejectWithValue }) => {
    try {
      const { data } = await axiosFetch.post("/auth/signup", user);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosFetch.get("/auth/logout");
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profilePic: FormData, { rejectWithValue }) => {
    try {
      const { data } = await axiosFetch.put("/auth/update-profile", profilePic);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Logged in successfully");
      })
      .addCase(login.rejected, (state, action) => {
        state.error = new Error(
          (action.payload as { message: string }).message
        );
        state.loading = false;
        toast.error(state.error.message);
      })
      .addCase(authCheck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(authCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as Error;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        toast.success("Account created successfully");
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = new Error(
          (action.payload as { message: string }).message
        );
        state.loading = false;
        toast.error(state.error.message);
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        toast.success("Logged out successfully");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as Error;
        toast.error("Something went wrong");
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Profile updated successfully");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as Error;
        state.loading = false;
        toast.error("Something went wrong");
      });
  },
});

export default authSlice.reducer;
