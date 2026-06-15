import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "./customersTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchCustomersApi = async (): Promise<Customer[]> => {
  const response = await api.get(API_ENDPOINTS.CUSTOMERS);
  return getResponseData<Customer[]>(response);
};

export const createCustomerApi = async (
  payload: CreateCustomerRequest,
): Promise<Customer> => {
  const response = await api.post(API_ENDPOINTS.CUSTOMERS, payload);
  return getResponseData<Customer>(response);
};

export const updateCustomerApi = async (
  payload: UpdateCustomerRequest,
): Promise<Customer> => {
  const { id, ...body } = payload;

  const response = await api.put(API_ENDPOINTS.CUSTOMER_BY_ID(id), body);

  return getResponseData<Customer>(response);
};

export const deleteCustomerApi = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete(API_ENDPOINTS.CUSTOMER_BY_ID(id));

  return getResponseData<{ message: string }>(response);
};
