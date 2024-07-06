import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SalesPIInquiryState = {
  id_divisi: string;
  rumah_sakit: string;
  alamat: string;
  nomor_invoice: string;
  nomor_surat_jalan: string;
  nomor_po: string;
  nomor_si: string;
  tanggal: string;
  jatuh_tempo: string;
  sub_total: string;
  pajak_ppn: string;
  total: string;
  RP_sub_total: string;
  RP_pajak_ppn: string;
  RP_total: string;
  nama_dokter: string;
  nama_pasien: string;
  rm: string;
  item: ItemState[];
};

type ItemState = {
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
  sub_total_item: string;
  RP_sub_total_item: string;
};

type InitialState = {
  value: SalesPIInquiryState;
};

const initialState: InitialState = {
  value: {
    id_divisi: "",
    rumah_sakit: "",
    alamat: "",
    nomor_invoice: "",
    nomor_surat_jalan: "",
    nomor_po: "",
    nomor_si: "",
    tanggal: "",
    jatuh_tempo: "",
    sub_total: "",
    pajak_ppn: "",
    total: "",
    RP_sub_total: "",
    RP_pajak_ppn: "",
    RP_total: "",
    nama_dokter: "",
    nama_pasien: "",
    rm: "",
    item: [],
  },
};

const salesPIInquirySlice = createSlice({
  name: "salesPIInquiry",
  initialState,
  reducers: {
    setSalesPIInquiry: (
      state,
      action: PayloadAction<Partial<SalesPIInquiryState>>,
    ) => {
      state.value = { ...state.value, ...action.payload };
    },
    clearSalesPIInquiry: () => initialState,
  },
});

export const { setSalesPIInquiry, clearSalesPIInquiry } =
  salesPIInquirySlice.actions;
export default salesPIInquirySlice.reducer;
