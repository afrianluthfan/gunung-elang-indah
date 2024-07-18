import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import itemPIReducer from "./features/itemPI-slice";
import listItemPIReducer from "./features/listItemPI-slice";
import salesPIItemNumberReducer from "./features/salesPIItemNumber-slice";
import divisiProfilingReducer from "./features/divisiProfiling-slice";
import salesPIInquirySliceReducer from "./features/salesPIInquiry-slice";
import itemProfilingReducer from "./features/iitemProfiling-slice";
import detailSOReducer from "./features/detailSO-slice";
import editPIReducer from "./features/editPI-slice";
import editPIItems from "./features/editPIItems-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";

const rootReducer = combineReducers({
  authReducer,
  itemPIReducer,
  listItemPIReducer,
  salesPIItemNumberReducer,
  divisiProfilingReducer,
  salesPIInquirySliceReducer,
  itemProfilingReducer,
  detailSOReducer,
  editPIReducer,
  editPIItems,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
