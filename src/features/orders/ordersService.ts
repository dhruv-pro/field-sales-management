import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { CreateOrderRequest, UpdateOrderRequest } from "./ordersTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchOrdersApi = async () => {
  const response = await api.get(API_ENDPOINTS.ORDERS);
  return getResponseData(response);
};

export const createOrderApi = async (payload: CreateOrderRequest) => {
  const response = await api.post(API_ENDPOINTS.ORDERS, payload);
  return getResponseData(response);
};

export const updateOrderApi = async (payload: UpdateOrderRequest) => {
  const { id, ...body } = payload;
  const response = await api.put(API_ENDPOINTS.ORDER_BY_ID(id), body);
  return getResponseData(response);
};

export const deleteOrderApi = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.ORDER_BY_ID(id));
  return getResponseData(response);
};
