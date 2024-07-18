import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemPOState = {
  to_supplier: string;
  note: string;
  prepared_by: string;
  jabatan: string;
  jumlahBarang: string;
  approved_by: string;
  jabatan_approve: string;
};

type InitialState = {
  value: ItemPOState;
};

const initialState: InitialState = {
  value: {
    to_supplier: "",
    note: "",
    prepared_by: "",
    jabatan: "",
    jumlahBarang: "",
    approved_by: "",
    jabatan_approve: "",
  },
};

export const itemPO = createSlice({
  name: "itemPO",
  initialState,
  reducers: {
    setItemPO: (state, action: PayloadAction<Partial<ItemPOState>>) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetItemPO: () => initialState,
  },
});

export const { setItemPO, resetItemPO } = itemPO.actions;
export default itemPO.reducer;
