import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  divisi: any;
  value: DivisiProfilingState;
};

type DivisiProfilingState = {
  divisi: string;
};

const initialState = {
  value: {
    divisi: "",
  } as DivisiProfilingState,
} as InitialState;

export const divisiProfiling = createSlice({
  name: "divisiProfiling",
  initialState,
  reducers: {
    setDivisiProfiling: (_state, action: PayloadAction<string>) => {
      return {
        value: {
          divisi: action.payload,
        },
      };
    },
  },
});

export const { setDivisiProfiling } = divisiProfiling.actions;
export default divisiProfiling.reducer;
