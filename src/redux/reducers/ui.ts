import { ContentType, type CourseInfo } from 'thu-learn-lib/lib/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SnackbarType } from '../../types/dialogs';
import { CARD_BATCH_LOAD_SIZE } from '../../constants';
import { type ContentInfo } from '../../types/data';

export interface UiState {
  showLoadingProgressBar: boolean;
  loadingProgress: number;
  paneHidden: boolean;
  showSnackbar: boolean;
  snackbarContent: string;
  snackbarType: SnackbarType;
  showLoginDialog: boolean;
  inLoginProgress: boolean;
  showNetworkErrorDialog: boolean;
  showNewSemesterDialog: boolean;
  showChangeSemesterDialog: boolean;
  ignoreWrongSemester: boolean;
  showLogoutDialog: boolean;
  showClearDataDialog: boolean;
  cardTypeFilter?: ContentType;
  cardVisibilityThreshold: number;
  cardCourseFilter?: CourseInfo;
  cardListTitle: string;
  detailUrl: string;
  detailContent?: ContentInfo;
  showContentIgnoreSetting: boolean;
  titleFilter?: string;
}

const initialState: UiState = {
  showLoadingProgressBar: false,
  loadingProgress: 0,
  paneHidden: false,
  showSnackbar: false,
  snackbarContent: '',
  snackbarType: SnackbarType.NOTIFICATION,
  showLoginDialog: false,
  inLoginProgress: false,
  showNetworkErrorDialog: false,
  showNewSemesterDialog: false,
  ignoreWrongSemester: false,
  showLogoutDialog: false,
  showClearDataDialog: false,
  showChangeSemesterDialog: false,
  cardTypeFilter: undefined,
  cardVisibilityThreshold: CARD_BATCH_LOAD_SIZE,
  cardCourseFilter: undefined,
  cardListTitle: '主页',
  detailUrl: 'src/welcome.html',
  detailContent: undefined,
  showContentIgnoreSetting: false,
  titleFilter: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLoadingProgressBar: (state, action: PayloadAction<boolean>) => {
      state.showLoadingProgressBar = action.payload;
    },
    setLoadingProgress: (state, action: PayloadAction<number>) => {
      state.loadingProgress = action.payload;
    },
    togglePane: (state, action: PayloadAction<boolean>) => {
      state.paneHidden = action.payload;
    },
    toggleSnackbar: (state, action: PayloadAction<boolean>) => {
      state.showSnackbar = action.payload;
    },
    setSnackbar: (state, action: PayloadAction<{ type: SnackbarType; content: string }>) => {
      state.snackbarType = action.payload.type;
      state.snackbarContent = action.payload.content;
    },
    showSnackbar: (state, action: PayloadAction<{ type: SnackbarType; content: string }>) => {
      state.snackbarType = action.payload.type;
      state.snackbarContent = action.payload.content;
      state.showSnackbar = true;
    },
    toggleLoginDialog: (state, action: PayloadAction<boolean>) => {
      state.showLoginDialog = action.payload;
    },
    toggleLoginDialogProgress: (state, action: PayloadAction<boolean>) => {
      state.inLoginProgress = action.payload;
    },
    loginEnd: (state) => {
      state.showLoginDialog = false;
      state.inLoginProgress = false;
    },
    toggleNetworkErrorDialog: (state, action: PayloadAction<boolean>) => {
      state.showNetworkErrorDialog = action.payload;
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
    setCardFilter: (state, action: PayloadAction<{ type?: ContentType; course?: CourseInfo }>) => {
      state.cardTypeFilter = action.payload.type;
      state.cardCourseFilter = action.payload.course;
      state.cardVisibilityThreshold = CARD_BATCH_LOAD_SIZE;
    },
    loadMoreCard: (state) => {
      state.cardVisibilityThreshold += CARD_BATCH_LOAD_SIZE;
    },
    setCardListTitle: (state, action: PayloadAction<string>) => {
      state.cardListTitle = action.payload;
    },
    setDetailUrl: (state, action: PayloadAction<string>) => {
      state.detailUrl = action.payload;
      state.detailContent = undefined;
      state.showContentIgnoreSetting = false;
    },
    setDetailContent: (state, action: PayloadAction<ContentInfo>) => {
      state.detailContent = action.payload;
      state.showContentIgnoreSetting = false;
    },
    showContentIgnoreSetting: (state) => {
      state.showContentIgnoreSetting = true;
    },
    setTitleFilter: (state, action: PayloadAction<string>) => {
      state.titleFilter = action.payload;
    },
  },
});

export const {
  toggleLoadingProgressBar,
  setLoadingProgress,
  togglePane,
  toggleSnackbar,
  setSnackbar,
  showSnackbar,
  toggleLoginDialog,
  toggleLoginDialogProgress,
  loginEnd,
  toggleNetworkErrorDialog,
  toggleNewSemesterDialog,
  toggleIgnoreWrongSemester,
  toggleLogoutDialog,
  toggleClearDataDialog,
  toggleChangeSemesterDialog,
  setCardFilter,
  loadMoreCard,
  setCardListTitle,
  setDetailUrl,
  setDetailContent,
  showContentIgnoreSetting,
  setTitleFilter,
} = uiSlice.actions;

export default uiSlice.reducer;
