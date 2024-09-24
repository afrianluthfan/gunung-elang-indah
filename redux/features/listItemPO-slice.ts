import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ListItemPOState = {
  price: string;
  quantity: string;
  name: string;
  discount: string;

  // COMENT
  
  // price
  // quantity
  // name
  // discount
};

type InitialState = {
  value: ListItemPOState[];
};

const initialState: InitialState = {
  value: [],
};

export const listItemPO = createSlice({
  name: "listItemPO",
  initialState,
  reducers: {
    setListItemPO: (
      state,
      action: PayloadAction<{ index: number; item: ListItemPOState }>,
    ) => {
      state.value[action.payload.index] = action.payload.item;
    },
    setListItems: (state, action: PayloadAction<ListItemPOState[]>) => {
      state.value = action.payload;
    },
    resetListItemPO: () => initialState,
  },
});

export const { setListItemPO, setListItems, resetListItemPO } =
  listItemPO.actions;
export default listItemPO.reducer;
