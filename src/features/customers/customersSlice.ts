import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createCustomerApi,
  deleteCustomerApi,
  fetchCustomersApi,
  updateCustomerApi,
} from "./customersService";
import type {
  CreateCustomerRequest,
  CustomersState,
  UpdateCustomerRequest,
} from "./customersTypes";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, thunkAPI) => {
    try {
      return await fetchCustomersApi();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load customers.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (payload: CreateCustomerRequest, thunkAPI) => {
    try {
      return await createCustomerApi(payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create customer.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (payload: UpdateCustomerRequest, thunkAPI) => {
    try {
      return await updateCustomerApi(payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update customer.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id: string, thunkAPI) => {
    try {
      await deleteCustomerApi(id);
      return id;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to delete customer.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer,
        );
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload,
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customersSlice.reducer;
