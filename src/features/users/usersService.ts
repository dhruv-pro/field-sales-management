import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { User } from "../auth/authTypes";
import type { CreateUserRequest, UpdateUserRequest } from "./usersTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchUsersApi = async (): Promise<User[]> => {
  const response = await api.get(API_ENDPOINTS.USERS);
  return getResponseData<User[]>(response);
};

export const createUserApi = async (
  payload: CreateUserRequest,
): Promise<User> => {
  const response = await api.post(API_ENDPOINTS.USERS, payload);
  return getResponseData<User>(response);
};

export const updateUserApi = async (
  payload: UpdateUserRequest,
): Promise<User> => {
  const { id, ...body } = payload;

  const response = await api.put(API_ENDPOINTS.USER_BY_ID(id), body);

  return getResponseData<User>(response);
};

export const deleteUserApi = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete(API_ENDPOINTS.USER_BY_ID(id));

  return getResponseData<{ message: string }>(response);
};
