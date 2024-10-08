import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isAuth: boolean;
  username: string;
  password: string;
  statusAcount: string;
  isSA: boolean;
};

type InitialState = {
  value: AuthState;
};

const initialState: InitialState = {
  value: {
    isAuth: false,
    username: "",
    password: "",
    statusAcount: "",
    isSA: false,
  },
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (
      state,
      action: PayloadAction<{ username: string; password: string; statusAccount: string }>,
    ) => {
      state.value = {
        isAuth: action.payload.password === "qwerty12345", // Example check, replace with real authentication logic
        username: action.payload.username,
        statusAcount: action.payload.statusAccount,
        password: action.payload.password,
        isSA: false,
      };
    },
  },
});

export const { logOut, logIn } = auth.actions;
export default auth.reducer;
