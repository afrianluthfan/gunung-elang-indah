import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: ItemPIState;
};

type ItemPIState = {
  divisi: string;
  nomorInvoice: string;
  jatuhTempo: string;
  nomorSuratJalan: string;
  nomorPI: string;
  namaRumahSakit: string;
  jumlahBarang: string;
  tanggal: string;
  alamatRumahSakit: string;
};

const initialState = {
  value: {
    divisi: "",
    nomorInvoice: "",
    jatuhTempo: "",
    nomorSuratJalan: "",
    nomorPI: "",
    namaRumahSakit: "",
    jumlahBarang: "",
    tanggal: "",
    alamatRumahSakit: "",
  } as ItemPIState,
} as InitialState;

export const itemPI = createSlice({
  name: "itemPI",
  initialState,
  reducers: {
    setItemPI: (_state, action: PayloadAction<ItemPIState>) => {
      return {
        value: action.payload,
      };
    },
  },
});

export const { setItemPI } = itemPI.actions;
export default itemPI.reducer;
