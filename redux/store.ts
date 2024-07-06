import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import itemPIReducer from "./features/itemPI-slice";
import listItemPIReducer from "./features/listItemPI-slice";
import salesPIItemNumberReducer from "./features/salesPIItemNumber-slice";
import divisiProfilingReducer from "./features/divisiProfiling-slice";
import salesPIInquirySliceReducer from "./features/salesPIInquiry-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    authReducer,
    itemPIReducer,
    listItemPIReducer,
    salesPIItemNumberReducer,
    divisiProfilingReducer,
    salesPIInquirySliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
