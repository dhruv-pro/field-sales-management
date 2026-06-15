import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createOrderApi,
  deleteOrderApi,
  fetchOrdersApi,
  updateOrderApi,
} from "./ordersService";
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrdersState,
} from "./ordersTypes";

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, thunkAPI) => {
  try {
    return await fetchOrdersApi();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to load orders.",
    );
  }
});

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderRequest,
  { rejectValue: string }
>("orders/createOrder", async (payload, thunkAPI) => {
  try {
    return await createOrderApi(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to create order.",
    );
  }
});

export const updateOrder = createAsyncThunk<
  Order,
  UpdateOrderRequest,
  { rejectValue: string }
>("orders/updateOrder", async (payload, thunkAPI) => {
  try {
    return await updateOrderApi(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to update order.",
    );
  }
});

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("orders/deleteOrder", async (id, thunkAPI) => {
  try {
    await deleteOrderApi(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to delete order.",
    );
  }
});
const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order,
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload,
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ordersSlice.reducer;
