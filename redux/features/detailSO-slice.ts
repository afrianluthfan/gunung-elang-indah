import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DetailSOState = {
  id: number;
  customer_id: number;
  nama_customer?: string;
  status: string;
  divisi: string;
  invoice_number: string;
  nomor_surat_jalan?: string;
  po_number: string;
  due_date: string;
  doctor_name: string;
  patient_name: string;
  tanggal_tindakan?: string; // Optional field
  tanggal?: string; // Optional field
  rm?: string; // Optional field
  number_si?: string; // Optional field
  RP_sub_total: string;
  RP_pajak_ppn: string;
  RP_total: string;
  item_detail_pi: ItemState[];
};

type ItemState = {
  id: number;
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
  sub_total_item: string;
};

type InitialState = {
  value: DetailSOState;
};

const initialState: InitialState = {
  value: {
    id: 0,
    customer_id: 0,
    nama_customer: "",
    status: "",
    divisi: "",
    invoice_number: "",
    nomor_surat_jalan: "",
    po_number: "",
    due_date: "",
    doctor_name: "",
    patient_name: "",
    tanggal_tindakan: "",
    tanggal: "",
    rm: "",
    number_si: "",
    RP_sub_total: "",
    RP_pajak_ppn: "",
    RP_total: "",
    item_detail_pi: [],
  },
};

const detailSOSlice = createSlice({
  name: "detailSO",
  initialState,
  reducers: {
    setdetailSO: (state, action: PayloadAction<Partial<DetailSOState>>) => {
      state.value = { ...state.value, ...action.payload };
    },
    cleardetailSO: () => initialState,
  },
});

export const { setdetailSO, cleardetailSO } = detailSOSlice.actions;
export default detailSOSlice.reducer;
