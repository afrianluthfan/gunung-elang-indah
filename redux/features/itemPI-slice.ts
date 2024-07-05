import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  namaDokter: string;
  rm: string;
  namaPasien: string;
  idRS: string;
};

type InitialState = {
  value: ItemPIState;
};

const initialState: InitialState = {
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
    namaDokter: "",
    rm: "",
    namaPasien: "",
    idRS: "",
  },
};

export const itemPI = createSlice({
  name: "itemPI",
  initialState,
  reducers: {
    setItemPI: (state, action: PayloadAction<Partial<ItemPIState>>) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetItemPI: () => initialState,
  },
});

export const { setItemPI, resetItemPI } = itemPI.actions;
export default itemPI.reducer;
