import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchVisitsApi,
  fetchMyVisitsApi,
  fetchVisitByIdApi,
  createVisitApi,
  completeVisitApi,
  uploadVisitPhotoApi,
  uploadVisitSelfieApi,
} from "./visitsService";
import type { CreateVisitRequest, Visit, VisitsState } from "./visitsTypes";

export const fetchVisits = createAsyncThunk<
  Visit[],
  void,
  { rejectValue: string }
>("visits/fetchVisits", async (_, thunkAPI) => {
  try {
    return await fetchVisitsApi();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load visits.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchMyVisits = createAsyncThunk<
  Visit[],
  void,
  { rejectValue: string }
>("visits/fetchMyVisits", async (_, thunkAPI) => {
  try {
    return await fetchMyVisitsApi();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load my visits.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchVisitById = createAsyncThunk<
  Visit,
  string,
  { rejectValue: string }
>("visits/fetchVisitById", async (id, thunkAPI) => {
  try {
    return await fetchVisitByIdApi(id);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load visit.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const createVisit = createAsyncThunk<
  Visit,
  CreateVisitRequest,
  { rejectValue: string }
>("visits/createVisit", async (payload, thunkAPI) => {
  try {
    return await createVisitApi(payload);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to create visit.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const completeVisit = createAsyncThunk<
  Visit,
  string,
  { rejectValue: string }
>("visits/completeVisit", async (id, thunkAPI) => {
  try {
    return await completeVisitApi(id);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to complete visit.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const uploadVisitPhoto = createAsyncThunk<
  any,
  { id: string; formData: FormData },
  { rejectValue: string }
>("visits/uploadVisitPhoto", async ({ id, formData }, thunkAPI) => {
  try {
    return await uploadVisitPhotoApi(id, formData);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to upload visit photo.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const uploadVisitSelfie = createAsyncThunk<
  any,
  { id: string; formData: FormData },
  { rejectValue: string }
>("visits/uploadVisitSelfie", async ({ id, formData }, thunkAPI) => {
  try {
    return await uploadVisitSelfieApi(id, formData);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to upload visit selfie.";
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState: VisitsState = {
  visits: [],
  myVisits: [],
  selectedVisit: null,
  loading: false,
  error: null,
};

const visitsSlice = createSlice({
  name: "visits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.myVisits = action.payload;
      })
      .addCase(fetchMyVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchVisitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVisit = action.payload;
      })
      .addCase(fetchVisitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.visits.unshift(action.payload);
        state.myVisits.unshift(action.payload);
      })
      .addCase(createVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = state.visits.map((visit) =>
          visit._id === action.payload._id ? action.payload : visit,
        );
        if (state.selectedVisit?._id === action.payload._id) {
          state.selectedVisit = action.payload;
        }
      })
      .addCase(completeVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadVisitPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVisitPhoto.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadVisitPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadVisitSelfie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVisitSelfie.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadVisitSelfie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default visitsSlice.reducer;
