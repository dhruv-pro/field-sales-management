import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { CreateVisitRequest, Visit } from "./visitsTypes";

const getResponseData = <T>(response: any): T => {
  return response?.data?.data ?? response?.data;
};

export const fetchVisitsApi = async (): Promise<Visit[]> => {
  const response = await api.get(API_ENDPOINTS.VISITS);
  return getResponseData<Visit[]>(response);
};

export const fetchMyVisitsApi = async (): Promise<Visit[]> => {
  const response = await api.get(API_ENDPOINTS.MY_VISITS);
  return getResponseData<Visit[]>(response);
};

export const fetchVisitByIdApi = async (id: string): Promise<Visit> => {
  const response = await api.get(API_ENDPOINTS.VISIT_BY_ID(id));
  return getResponseData<Visit>(response);
};

export const createVisitApi = async (
  payload: CreateVisitRequest,
): Promise<Visit> => {
  const response = await api.post(API_ENDPOINTS.VISITS, payload);
  return getResponseData<Visit>(response);
};

export const completeVisitApi = async (id: string): Promise<Visit> => {
  const response = await api.put(API_ENDPOINTS.VISIT_COMPLETE(id));
  return getResponseData<Visit>(response);
};

export const uploadVisitPhotoApi = async (
  id: string,
  payload: FormData,
): Promise<any> => {
  const response = await api.post(API_ENDPOINTS.VISIT_PHOTOS(id), payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return getResponseData<any>(response);
};

export const uploadVisitSelfieApi = async (
  id: string,
  payload: FormData,
): Promise<any> => {
  const response = await api.post(API_ENDPOINTS.VISIT_SELFIE(id), payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return getResponseData<any>(response);
};
