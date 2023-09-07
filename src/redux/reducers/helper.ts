import { createSlice } from '@reduxjs/toolkit';
import { Learn2018Helper, type HelperConfig } from 'thu-learn-lib';

export interface HelperState {
  helper: Learn2018Helper;
  loggedIn: boolean;
}

const config: HelperConfig = {};

const initialState: HelperState = {
  helper: new Learn2018Helper(config),
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
      state.helper = new Learn2018Helper(config);
      state.loggedIn = false;
    },
  },
});

export default helperSlice.reducer;
