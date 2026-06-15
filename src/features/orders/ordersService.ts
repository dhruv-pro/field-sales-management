import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "./ordersTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchOrdersApi = async (): Promise<Order[]> => {
  const response = await api.get(API_ENDPOINTS.ORDERS);
  return getResponseData<Order[]>(response);
};

export const createOrderApi = async (
  payload: CreateOrderRequest,
): Promise<Order> => {
  const response = await api.post(API_ENDPOINTS.ORDERS, payload);
  return getResponseData<Order>(response);
};

export const updateOrderApi = async (
  payload: UpdateOrderRequest,
): Promise<Order> => {
  const { id, ...body } = payload;

  const response = await api.put(API_ENDPOINTS.ORDER_BY_ID(id), body);

  return getResponseData<Order>(response);
};

export const deleteOrderApi = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete(API_ENDPOINTS.ORDER_BY_ID(id));

  return getResponseData<{ message: string }>(response);
};
