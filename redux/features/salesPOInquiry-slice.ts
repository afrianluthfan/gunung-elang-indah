import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SalesPOInquiryState = {
  nama_suplier: string;
  nomor_po: string;
  tanggal: string;
  catatan_po: string;
  prepared_by: string;
  prepared_jabatan: string;
  approved_by: string;
  approved_jabatan: string;
  sub_total: string;
  pajak: string;
  total: string;
  item: ItemState[];
};

type ItemState = {
  name: string;
  quantity: string;
  price: string;
  discount: string;
  amount: string;
};

type InitialState = {
  value: SalesPOInquiryState;
};

const initialState: InitialState = {
  value: {
    nama_suplier: "",
    nomor_po: "",
    tanggal: "",
    catatan_po: "",
    prepared_by: "",
    prepared_jabatan: "",
    approved_by: "",
    approved_jabatan: "",
    sub_total: "",
    pajak: "",
    total: "",
    item: [],
  },
};

const salesPOInquirySlice = createSlice({
  name: "salesPOInquiry",
  initialState,
  reducers: {
    setSalesPOInquiry: (
      state,
      action: PayloadAction<Partial<SalesPOInquiryState>>,
    ) => {
      state.value = { ...state.value, ...action.payload };
    },
    clearSalesPOInquiry: () => initialState,
  },
});

export const { setSalesPOInquiry, clearSalesPOInquiry } =
  salesPOInquirySlice.actions;
export default salesPOInquirySlice.reducer;
