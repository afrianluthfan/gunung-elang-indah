import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import itemPIReducer from "./features/itemPI-slice";
import listItemPIReducer from "./features/listItemPI-slice";
import salesPIItemNumberReducer from "./features/salesPIItemNumber-slice";
import divisiProfilingReducer from "./features/divisiProfiling-slice";
import salesPIInquirySliceReducer from "./features/salesPIInquiry-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import itemProfilingReducer from "./features/iitemProfiling-slice";
import detailSOReducer from "./features/detailSO-slice";

// PO STATE INPORT FOR REDUXER ADIT 
import itemPOReducer from "./features/itemPo-slice";
import listItemPOReducer from "./features/listItemPO-slice";
import salesPOItemNumberReducer from "./features/salesPOItemNumber-slice";
import salesPOInquirySliceReducer from "./features/salesPOInquiry-slice";

export const store = configureStore({
  reducer: {
    authReducer,
    itemPIReducer,
    listItemPIReducer,
    salesPIItemNumberReducer,
    divisiProfilingReducer,
    salesPIInquirySliceReducer,
    itemProfilingReducer,
    detailSOReducer,
    itemPOReducer,
    listItemPOReducer,
    salesPOItemNumberReducer,
    salesPOInquirySliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
