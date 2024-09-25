import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DivisiProfilingState = {
  divisi: string;
};

type InitialState = {
  value: DivisiProfilingState;
};

const initialState: InitialState = {
  value: {
    divisi: "",
  },
};

export const divisiProfiling = createSlice({
  name: "divisiProfiling",
  initialState,
  reducers: {
    setDivisiProfiling: (state, action: PayloadAction<string>) => {
      state.value.divisi = action.payload;
    },
  },
});

export const { setDivisiProfiling } = divisiProfiling.actions;
export default divisiProfiling.reducer;
