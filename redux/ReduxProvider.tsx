"use client";

import React, { FC } from "react";
import { store } from "./store";
import { Provider } from "react-redux";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
