import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { TypedUseSelectorHook, useSelector } from "react-redux";
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
import itemPOReducer from "./features/itemPo-slice";
import listItemPOReducer from "./features/listItemPO-slice";
import salesPOItemNumberReducer from "./features/salesPOItemNumber-slice";
import salesPOInquirySliceReducer from "./features/salesPOInquiry-slice";

const rootReducer = combineReducers({
  auth: authReducer,
  itemPI: itemPIReducer,
  listItemPI: listItemPIReducer,
  salesPIItemNumber: salesPIItemNumberReducer,
  divisiProfiling: divisiProfilingReducer,
  salesPIInquiry: salesPIInquirySliceReducer,
  itemProfiling: itemProfilingReducer,
  detailSO: detailSOReducer,
  editPI: editPIReducer,
  editPIItems: editPIItems,
  itemPO: itemPOReducer,
  listItemPO: listItemPOReducer,
  salesPOItemNumber: salesPOItemNumberReducer,
  salesPOInquiry: salesPOInquirySliceReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [], // Optionally blacklist any keys that don't need to be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
