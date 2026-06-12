import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./authTypes";

export const loginApi = async (
  payload: LoginRequest,
): Promise<AuthResponse> => {
  const response = await api.post(API_ENDPOINTS.LOGIN, payload);

  return response.data;
};

export const registerApi = async (
  payload: RegisterRequest,
): Promise<AuthResponse> => {
  const response = await api.post(API_ENDPOINTS.REGISTER, payload);

  return response.data;
};

export const profileApi = async () => {
  const response = await api.get(API_ENDPOINTS.PROFILE);

  return response.data;
};
