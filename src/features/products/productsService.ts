import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "./productsTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchProductsApi = async (): Promise<Product[]> => {
  const response = await api.get(API_ENDPOINTS.PRODUCTS);
  return getResponseData<Product[]>(response);
};

export const createProductApi = async (
  payload: CreateProductRequest,
): Promise<Product> => {
  const response = await api.post(API_ENDPOINTS.PRODUCTS, payload);
  return getResponseData<Product>(response);
};

export const updateProductApi = async (
  payload: UpdateProductRequest,
): Promise<Product> => {
  const { id, ...body } = payload;
  const response = await api.put(API_ENDPOINTS.PRODUCT_BY_ID(id), body);
  return getResponseData<Product>(response);
};

export const deleteProductApi = async (id: string): Promise<void> => {
  const response = await api.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
  return getResponseData<void>(response);
};
