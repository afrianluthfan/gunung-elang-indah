import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Import reducers
import auth from "./features/auth-slice";
import itemPI from "./features/itemPI-slice";
import listItemPI from "./features/listItemPI-slice";
import salesPIItemNumber from "./features/salesPIItemNumber-slice";
import divisiProfiling from "./features/divisiProfiling-slice";
import salesPIInquiry from "./features/salesPIInquiry-slice";
import itemProfiling from "./features/iitemProfiling-slice";
import detailSO from "./features/detailSO-slice";
import editPI from "./features/editPI-slice";
import editPIItems from "./features/editPIItems-slice";
import itemPO from "./features/itemPo-slice";
import listItemPO from "./features/listItemPO-slice";
import salesPOItemNumber from "./features/salesPOItemNumber-slice";
import salesPOInquiry from "./features/salesPOInquiry-slice";

// Combine all reducers
const rootReducer = combineReducers({
  auth: auth,
  itemPI: itemPI,
  listItemPI: listItemPI,
  salesPIItemNumber: salesPIItemNumber,
  divisiProfiling: divisiProfiling,
  salesPIInquiry: salesPIInquiry,
  itemProfiling: itemProfiling,
  detailSO: detailSO,
  editPI: editPI,
  editPIItems: editPIItems,
  itemPO: itemPO,
  listItemPO: listItemPO,
  salesPOItemNumber: salesPOItemNumber,
  salesPOInquiry: salesPOInquiry,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Type declarations
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook for using selectors with typed state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
