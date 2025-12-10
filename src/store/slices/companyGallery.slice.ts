import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const COMPANY_GALLERY_URL = "http://localhost:3000/api/v1/company-gallery";

// Fetch all company gallery
export const getAllCompanyGallery = createAsyncThunk(
  "companyGallery/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(COMPANY_GALLERY_URL);
      return res.data.data; // expects { data: [...] }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const companyGallerySlice = createSlice({
  name: "companyGallery",
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCompanyGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCompanyGallery.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getAllCompanyGallery.rejected, (state) => {
        state.data = [];
        state.loading = false;
      });
  },
});

// Selector
export const selectCompanyGallery = (state: any) =>
  state.companyGallery.data;

export default companyGallerySlice.reducer;
