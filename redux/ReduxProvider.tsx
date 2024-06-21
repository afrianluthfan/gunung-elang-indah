"use client";

import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import ChildWrapper from "@/app/ChildWrapper";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ChildWrapper>{children}</ChildWrapper>
    </Provider>
  );
};

export default ReduxProvider;
