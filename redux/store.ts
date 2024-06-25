import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import itemPIReducer from "./features/itemPI-slice";
import listItemPIReducer from "./features/listItemPI-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    authReducer,
    itemPIReducer,
    listItemPIReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
