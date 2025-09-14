import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Learn2018Helper } from 'thu-learn-lib';

export interface HelperState {
  helper: Learn2018Helper;
  loggedIn: boolean;
}

const initialState: HelperState = {
  helper: new Learn2018Helper(),
  loggedIn: false,
};

export const helperSlice = createSlice({
  name: 'helper',
  initialState,
  reducers: {
    loggedIn: (state) => {
      state.loggedIn = true;
    },
    loggedOut: (state) => {
      state.helper = new Learn2018Helper();
      state.loggedIn = false;
    },
    updateHelper: (state, action: PayloadAction<Learn2018Helper>) => {
      state.helper = action.payload;
    },
  },
});

export default helperSlice.reducer;
