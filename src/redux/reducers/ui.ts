import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { CARD_BATCH_LOAD_SIZE } from '../../constants';
import type { SupportedContentType } from '../../types/data';

interface CardEntry {
  type: SupportedContentType;
  id: string;
}
interface CardFilter {
  type?: SupportedContentType | 'ignored';
  courseId?: string;
}

export interface UiState {
  loadingProgress?: number;
  paneHidden: boolean;
  showLoginDialog: boolean;
  inLoginProgress: boolean;
  showNewSemesterDialog: boolean;
  showChangeSemesterDialog: boolean;
  ignoreWrongSemester: boolean;
  showLogoutDialog: boolean;
  showClearDataDialog: boolean;
  cardVisibilityThreshold: number;
  cardList: CardEntry[];
  cardFilter: CardFilter;
  titleFilter?: string;
}

const initialState: UiState = {
  loadingProgress: undefined,
  paneHidden: false,
  showLoginDialog: false,
  inLoginProgress: false,
  showNewSemesterDialog: false,
  ignoreWrongSemester: false,
  showLogoutDialog: false,
  showClearDataDialog: false,
  showChangeSemesterDialog: false,
  cardVisibilityThreshold: CARD_BATCH_LOAD_SIZE,
  cardList: [],
  cardFilter: {},
  titleFilter: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoadingProgress: (state, action: PayloadAction<number | undefined>) => {
      state.loadingProgress = action.payload;
    },
    togglePaneHidden: (state, action: PayloadAction<boolean>) => {
      state.paneHidden = action.payload;
    },
    toggleLoginDialog: (state, action: PayloadAction<boolean>) => {
      state.showLoginDialog = action.payload;
    },
    toggleLoginDialogProgress: (state, action: PayloadAction<boolean>) => {
      state.inLoginProgress = action.payload;
    },
    loginEnd: (state, action: PayloadAction<boolean>) => {
      if (action.payload) state.showLoginDialog = false;
      state.inLoginProgress = false;
    },
    toggleNewSemesterDialog: (state, action: PayloadAction<boolean>) => {
      state.showNewSemesterDialog = action.payload;
    },
    toggleIgnoreWrongSemester: (state, action: PayloadAction<boolean>) => {
      state.ignoreWrongSemester = action.payload;
    },
    toggleLogoutDialog: (state, action: PayloadAction<boolean>) => {
      state.showLogoutDialog = action.payload;
    },
    toggleClearDataDialog: (state, action: PayloadAction<boolean>) => {
      state.showClearDataDialog = action.payload;
    },
    toggleChangeSemesterDialog: (state, action: PayloadAction<boolean>) => {
      state.showChangeSemesterDialog = action.payload;
    },
    resetCardVisibilityThreshold: (state) => {
      state.cardVisibilityThreshold = CARD_BATCH_LOAD_SIZE;
    },
    loadMoreCard: (state) => {
      state.cardVisibilityThreshold += CARD_BATCH_LOAD_SIZE;
    },
    setCardList: (state, action: PayloadAction<CardEntry[]>) => {
      state.cardList = action.payload;
    },
    setCardFilter: (state, action: PayloadAction<CardFilter>) => {
      state.cardFilter = action.payload;
    },
    setTitleFilter: (state, action: PayloadAction<string | undefined>) => {
      state.titleFilter = action.payload;
    },
  },
});

export default uiSlice.reducer;
