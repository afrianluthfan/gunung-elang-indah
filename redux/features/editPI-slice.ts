// editPISlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemDetailPI = {
  kat: string;
  hSatuan: string;
  namaBarang: string;
  disc: string;
  qty: string;
  subTotal: string;
};

interface EditPIState {
  divisi: string;
  jatuhTempo: string;
  namaRumahSakit: string;
  jumlahBarang: string;
  alamatRumahSakit: string;
  rm: string;
  tanggalTindakan: string;
  namaDokter: string;
  namaPasien: string;
  tanggalInvoice: string;
}

const initialState: EditPIState = {
  divisi: "",
  jatuhTempo: "",
  namaRumahSakit: "",
  jumlahBarang: "",
  alamatRumahSakit: "",
  rm: "",
  tanggalTindakan: "",
  namaDokter: "",
  namaPasien: "",
  tanggalInvoice: "",
};

const editPISlice = createSlice({
  name: "editPI",
  initialState,
  reducers: {
    setEditPIField: (
      state,
      action: PayloadAction<{ field: keyof EditPIState; value: string }>,
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setEditPIData: (state, action: PayloadAction<EditPIState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setEditPIField, setEditPIData } = editPISlice.actions;
export default editPISlice.reducer;
