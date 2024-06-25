import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: ListItemPIState;
};

type ListItemPIState = {
  kat: string;
  hSatuan: string;
  namaBarang: string;
  disc: string;
  qty: string;
  subTotal: string;
};

const initialState = {
  value: {
    kat: "",
    hSatuan: "",
    namaBarang: "",
    disc: "",
    qty: "",
    subTotal: "",
  } as ListItemPIState,
} as InitialState;

export const listItemPI = createSlice({
  name: "listItemPI",
  initialState,
  reducers: {
    setListItemPI: (_state, action: PayloadAction<ListItemPIState>) => {
      return {
        value: action.payload,
      };
    },
  },
});

export const { setListItemPI } = listItemPI.actions;
export default listItemPI.reducer;
