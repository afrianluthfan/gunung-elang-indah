import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: AuthState;
};

type AuthState = {
  isAuth: boolean;
  username: string;
  uid: string;
  isSA: boolean;
};

const initialState = {
  value: {
    isAuth: false,
    username: "",
    uid: "",
    isSA: false,
  } as AuthState,
} as InitialState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (_state, action: PayloadAction<string>) => {
      return {
        value: {
          isAuth: true,
          username: action.payload,
          uid: "asdfghjkl",
          isSA: false,
        },
      };
    },
  },
});

export const { logOut, logIn } = auth.actions;
export default auth.reducer;
