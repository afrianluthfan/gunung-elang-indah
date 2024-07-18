import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: SPOnState;
};

type SPOnState = {
  amount: number;
};

const initialState = {
  value: {
    amount: 0,
  } as SPOnState,
} as InitialState;

export const SPOn = createSlice({
  name: "SPOn",
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

export const { clear, setAmount } = SPOn.actions;
export default SPOn.reducer;
