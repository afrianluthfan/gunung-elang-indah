import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemProfilingState = {
  name: string;
  nama_company: string;
  address_company: string;
  npwp_address: string;
  npwp: string;
  ipak_number: string;
  facture_address: string;
  city_facture: string;
  zip_code_facture: string;
  number_phone_facture: string;
  email_facture: string;
  fax_facture: string;
  pic_facture: string;
  item_address: string;
  city_item: string;
  zip_code_item: string;
  number_phone_item: string;
  email_item: string;
  fax_item: string;
  pic_item: string;
  contact_person: string;
  tax_code_id: string;
  top: string;
  handphone: string;
};

type InitialState = {
  value: ItemProfilingState;
};

const initialState: InitialState = {
  value: {
    name: "",
    nama_company: "",
    address_company: "",
    npwp_address: "",
    npwp: "",
    ipak_number: "",
    facture_address: "",
    city_facture: "",
    zip_code_facture: "",
    number_phone_facture: "",
    email_facture: "",
    fax_facture: "",
    pic_facture: "",
    item_address: "",
    city_item: "",
    zip_code_item: "",
    number_phone_item: "",
    email_item: "",
    fax_item: "",
    pic_item: "",
    contact_person: "",
    tax_code_id: "",
    top: "",
    handphone: "",
  },
};

export const itemProfiling = createSlice({
  name: "itemProfiling",
  initialState,
  reducers: {
    setItemProfiling: (
      state,
      action: PayloadAction<Partial<ItemProfilingState>>,
    ) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetItemProfiling: () => initialState,
  },
});

export const { setItemProfiling, resetItemProfiling } = itemProfiling.actions;
export default itemProfiling.reducer;
