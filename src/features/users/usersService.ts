import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { CreateUserRequest, UpdateUserRequest } from "./usersTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchUsersApi = async () => {
  const response = await api.get(API_ENDPOINTS.USERS);
  return getResponseData(response);
};

export const createUserApi = async (payload: CreateUserRequest) => {
  const response = await api.post(API_ENDPOINTS.USERS, payload);
  return getResponseData(response);
};

export const updateUserApi = async (payload: UpdateUserRequest) => {
  const { id, ...body } = payload;
  const response = await api.put(API_ENDPOINTS.USER_BY_ID(id), body);
  return getResponseData(response);
};

export const deleteUserApi = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.USER_BY_ID(id));
  return getResponseData(response);
};
