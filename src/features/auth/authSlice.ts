import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { loginApi, profileApi, registerApi } from "./authService";

import { storage } from "../../utils/storage";
import type { AuthState } from "./authTypes";

export const login = createAsyncThunk(
  "auth/login",
  async (
    payload: {
      email: string;
      password: string;
    },
    thunkAPI,
  ) => {
    try {
      return await loginApi(payload);
    } catch (error: any) {
      const data = error?.response?.data;
      const message =
        data?.message ||
        (Array.isArray(data?.errors)
          ? data.errors.map((err: any) => err.msg).join(" ")
          : error?.message) ||
        "Login failed";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role?: "admin" | "manager" | "employee";
    },
    thunkAPI,
  ) => {
    try {
      return await registerApi(payload);
    } catch (error: any) {
      const data = error?.response?.data;
      const message =
        data?.message ||
        (Array.isArray(data?.errors)
          ? data.errors.map((err: any) => err.msg).join(" ")
          : error?.message) ||
        "Registration failed";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, thunkAPI) => {
    try {
      return await profileApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  },
);

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("sfa_user");

    if (!user || user === "undefined") {
      return null;
    }

    const parsed = JSON.parse(user);

    if (!parsed?._id || !parsed?.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: storage.getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("sfa_user");
      storage.removeToken();
    },
  },

  extraReducers(builder) {
    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.data.user;

        state.token = action.payload.data.token;
        localStorage.setItem(
          "sfa_user",
          JSON.stringify(action.payload.data.user),
        );
        storage.setToken(action.payload.data.token);
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem(
          "sfa_user",
          JSON.stringify(action.payload.data.user),
        );
        storage.setToken(action.payload.data.token);
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProfile.fulfilled, (state, action: any) => {
        state.loading = false;

        const user = action.payload?.data?.user ?? action.payload?.data;

        if (user?._id && user?.role) {
          state.user = user;
          localStorage.setItem("sfa_user", JSON.stringify(user));
        }
      })

      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
