import { Learn2018Helper } from 'thu-learn-lib';
import type { HelperConfig } from 'thu-learn-lib/lib/types';

import { createSlice } from '@reduxjs/toolkit';

export interface HelperState {
  helper: Learn2018Helper;
  loggedIn: boolean;
}

const config: HelperConfig = {
  fixCourseEnglishName: true,
};

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

export const { loggedIn, loggedOut } = helperSlice.actions;

export default helperSlice.reducer;
