import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createCustomerApi,
  deleteCustomerApi,
  fetchCustomersApi,
  updateCustomerApi,
} from "./customersService";
import type {
  CreateCustomerRequest,
  Customer,
  CustomersState,
  UpdateCustomerRequest,
} from "./customersTypes";

export const fetchCustomers = createAsyncThunk<
  Customer[], // Return type
  void, // Argument type
  { rejectValue: string }
>("customers/fetchCustomers", async (_, thunkAPI) => {
  try {
    return await fetchCustomersApi();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to load customers.",
    );
  }
});

export const createCustomer = createAsyncThunk<
  Customer,
  CreateCustomerRequest,
  { rejectValue: string }
>("customers/createCustomer", async (payload, thunkAPI) => {
  try {
    return await createCustomerApi(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to create customer.",
    );
  }
});
export const updateCustomer = createAsyncThunk<
  Customer,
  UpdateCustomerRequest,
  { rejectValue: string }
>("customers/updateCustomer", async (payload, thunkAPI) => {
  try {
    return await updateCustomerApi(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to update customer.",
    );
  }
});

export const deleteCustomer = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("customers/deleteCustomer", async (id, thunkAPI) => {
  try {
    await deleteCustomerApi(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to delete customer.",
    );
  }
});
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
