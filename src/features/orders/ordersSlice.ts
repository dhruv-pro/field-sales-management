import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createOrderApi,
  deleteOrderApi,
  fetchOrdersApi,
  updateOrderApi,
} from "./ordersService";
import type {
  CreateOrderRequest,
  OrdersState,
  UpdateOrderRequest,
} from "./ordersTypes";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      return await fetchOrdersApi();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load orders.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (payload: CreateOrderRequest, thunkAPI) => {
    try {
      return await createOrderApi(payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create order.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (payload: UpdateOrderRequest, thunkAPI) => {
    try {
      return await updateOrderApi(payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update order.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id: string, thunkAPI) => {
    try {
      await deleteOrderApi(id);
      return id;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to delete order.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

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
