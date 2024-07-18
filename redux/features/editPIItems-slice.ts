import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EditPIItems = {
  kat: string;
  harga_satuan: string;
  nama_barang: string;
  discount: string;
  quantity: string;
};

type InitialState = {
  value: EditPIItems[];
};

const initialState: InitialState = {
  value: [],
};

export const editPIItems = createSlice({
  name: "editPIItems",
  initialState,
  reducers: {
    setEditPIItem: (
      state,
      action: PayloadAction<{ index: number; item: EditPIItems }>,
    ) => {
      state.value[action.payload.index] = action.payload.item;
    },
    setEditPIItems: (state, action: PayloadAction<EditPIItems[]>) => {
      state.value = action.payload;
    },
    resetEditPIItem: () => initialState,
  },
});

export const { setEditPIItem, setEditPIItems, resetEditPIItem } =
  editPIItems.actions;
export default editPIItems.reducer;
