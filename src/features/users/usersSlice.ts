import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../auth/authTypes";

import {
  createUserApi,
  deleteUserApi,
  fetchUsersApi,
  updateUserApi,
} from "./usersService";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UsersState,
} from "./usersTypes";

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, thunkAPI) => {
  try {
    return await fetchUsersApi();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to load users.",
    );
  }
});

export const createUser = createAsyncThunk<
  User,
  CreateUserRequest,
  { rejectValue: string }
>("users/createUser", async (payload, thunkAPI) => {
  try {
    return await createUserApi(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to create user.",
    );
  }
});

export const updateUser = createAsyncThunk<
  User,
  UpdateUserRequest,
  { rejectValue: string }
>("users/updateUser", async (payload, thunkAPI) => {
  try {
    return await updateUserApi(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to update user.",
    );
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("users/deleteUser", async (id, thunkAPI) => {
  try {
    await deleteUserApi(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to delete user.",
    );
  }
});

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user,
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
