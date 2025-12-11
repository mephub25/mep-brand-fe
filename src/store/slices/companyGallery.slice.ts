import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/company-gallery";

// Thunk
export const getCompanyGallery = createAsyncThunk(
  "companyGallery/getCompanyGallery",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await axios.get(API_URL, { params: { page, limit } });
    // Return the actual array and pagination info
    return {
      items: response.data.data, // <- gallery array
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
    };
  }
);

interface CompanyGalleryItem {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  createdAt?: string;
}

interface CompanyGalleryState {
  items: CompanyGalleryItem[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
}

const initialState: CompanyGalleryState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
};

const companyGallerySlice = createSlice({
  name: "companyGallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanyGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getCompanyGallery.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectCompanyGallery = (state: any) => state.companyGallery.items;
export const selectGalleryPagination = (state: any) => ({
  total: state.companyGallery.total,
  page: state.companyGallery.page,
  limit: state.companyGallery.limit,
});

export default companyGallerySlice.reducer;
