import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ContentType } from 'thu-learn-lib';

import { CARD_BATCH_LOAD_SIZE } from '../../constants';
import { type ContentInfo } from '../../types/data';

interface CardEntry {
  type: ContentType;
  id: string;
}
interface CardFilter {
  type?: ContentType | null;
  courseId?: string;
}

interface DetailPaneUrl {
  type: 'url';
  url: string;
}
interface DetailPaneContent {
  type: 'content';
  contentType: ContentType;
  contentId: string;
}

type DetailPage = 'content-ignore-setting' | 'about' | 'changelog' | 'readme' | 'welcome';
interface DetailPanePage {
  type: 'page';
  page: DetailPage;
}
type DetailPane = DetailPaneUrl | DetailPaneContent | DetailPanePage;

export interface UiState {
  loadingProgress?: number;
  paneHidden: boolean;
  showLoginDialog: boolean;
  inLoginProgress: boolean;
  showNetworkErrorDialog: boolean;
  showNewSemesterDialog: boolean;
  showChangeSemesterDialog: boolean;
  ignoreWrongSemester: boolean;
  showLogoutDialog: boolean;
  showClearDataDialog: boolean;
  cardVisibilityThreshold: number;
  cardListTitle: string;
  cardList: CardEntry[];
  cardFilter: CardFilter;
  detailPane: DetailPane;
  titleFilter?: string;
}

const initialState: UiState = {
  loadingProgress: undefined,
  paneHidden: false,
  showLoginDialog: false,
  inLoginProgress: false,
  showNetworkErrorDialog: false,
  showNewSemesterDialog: false,
  ignoreWrongSemester: false,
  showLogoutDialog: false,
  showClearDataDialog: false,
  showChangeSemesterDialog: false,
  cardVisibilityThreshold: CARD_BATCH_LOAD_SIZE,
  cardListTitle: '主页',
  cardList: [],
  cardFilter: {},
  detailPane: { type: 'page', page: 'welcome' },
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
    resetCardVisibilityThreshold: (state) => {
      state.cardVisibilityThreshold = CARD_BATCH_LOAD_SIZE;
    },
    loadMoreCard: (state) => {
      state.cardVisibilityThreshold += CARD_BATCH_LOAD_SIZE;
    },
    setCardListTitle: (state, action: PayloadAction<string>) => {
      state.cardListTitle = action.payload;
    },
    setCardList: (state, action: PayloadAction<CardEntry[]>) => {
      state.cardList = action.payload;
    },
    setCardFilter: (state, action: PayloadAction<CardFilter>) => {
      state.cardFilter = action.payload;
    },
    setDetailUrl: (state, action: PayloadAction<string>) => {
      state.detailPane = { type: 'url', url: action.payload };
    },
    setDetailContent: (state, action: PayloadAction<ContentInfo>) => {
      state.detailPane = {
        type: 'content',
        contentType: action.payload.type,
        contentId: action.payload.id,
      };
    },
    setDetailPage: (state, action: PayloadAction<DetailPage>) => {
      state.detailPane = {
        type: 'page',
        page: action.payload,
      };
    },
    setTitleFilter: (state, action: PayloadAction<string | undefined>) => {
      state.titleFilter = action.payload;
    },
  },
});

export default uiSlice.reducer;
