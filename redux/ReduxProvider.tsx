"use client";

import React, { FC } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import ChildWrapper from "@/app/ChildWrapper";
import { PersistGate } from "redux-persist/integration/react";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChildWrapper>{children}</ChildWrapper>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
