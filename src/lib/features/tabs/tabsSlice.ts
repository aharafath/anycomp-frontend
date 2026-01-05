import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabsState {
  value: number;
}

const initialState: TabsState = {
  value: 0,
};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
   
    activeTab: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { activeTab } = tabsSlice.actions;
export default tabsSlice.reducer;
