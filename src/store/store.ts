import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import activitySlice from "./slices/activity.slice";
import gallerySlice from "./slices/gallery.slice";
import projectSlice from "./slices/project.slice";
import testimonialSlice from "./slices/testimonial.slice";
import memberSlice from "./slices/member.slice";
import certificateSlice from "./slices/certificate.slice";

import companyGalleryReducer from "./slices/companyGallery.slice";

const logger = createLogger({
  collapsed: true,
  timestamp: true,
  predicate: () => import.meta.env.DEV,
});

export const store = configureStore({
  reducer: {
    project: projectSlice.reducer,
    testimonial: testimonialSlice.reducer,
    activity: activitySlice.reducer,
    gallery: gallerySlice.reducer,
    member: memberSlice.reducer,
    certificate: certificateSlice.reducer,
    companyGallery: companyGalleryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
