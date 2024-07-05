import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ListItemPIState = {
  kat: string;
  hSatuan: string;
  namaBarang: string;
  disc: string;
  qty: string;
  subTotal: string;
};

type InitialState = {
  value: ListItemPIState[];
};

const initialState: InitialState = {
  value: [],
};

export const listItemPI = createSlice({
  name: "listItemPI",
  initialState,
  reducers: {
    setListItemPI: (
      state,
      action: PayloadAction<{ index: number; item: ListItemPIState }>,
    ) => {
      state.value[action.payload.index] = action.payload.item;
    },
    setListItems: (state, action: PayloadAction<ListItemPIState[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setListItemPI, setListItems } = listItemPI.actions;
export default listItemPI.reducer;
