import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: SPInState;
};

type SPInState = {
  amount: number;
};

const initialState = {
  value: {
    amount: 0,
  } as SPInState,
} as InitialState;

export const SPIn = createSlice({
  name: "SPIn",
  initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
    setAmount: (_state, action: PayloadAction<number>) => {
      return {
        value: {
          amount: action.payload,
        },
      };
    },
  },
});

export const { clear, setAmount } = SPIn.actions;
export default SPIn.reducer;
