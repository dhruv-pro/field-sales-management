import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "./customersTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchCustomersApi = async () => {
  const response = await api.get(API_ENDPOINTS.CUSTOMERS);
  return getResponseData(response);
};

export const createCustomerApi = async (payload: CreateCustomerRequest) => {
  const response = await api.post(API_ENDPOINTS.CUSTOMERS, payload);
  return getResponseData(response);
};

export const updateCustomerApi = async (payload: UpdateCustomerRequest) => {
  const { id, ...body } = payload;
  const response = await api.put(API_ENDPOINTS.CUSTOMER_BY_ID(id), body);
  return getResponseData(response);
};

export const deleteCustomerApi = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.CUSTOMER_BY_ID(id));
  return getResponseData(response);
};
