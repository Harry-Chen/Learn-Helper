import { ContentType, CourseInfo } from 'thu-learn-lib/lib/types';

import { UiActionType } from './actionTypes';

import { SnackbarType } from '../../types/dialogs';
import { ContentInfo, FileInfo } from '../../types/data';
import { initiateFileDownload } from '../../utils/download';
import { toggleReadState } from './data';
import { STATE_HELPER } from '../reducers';
import { HelperState } from '../reducers/helper';
import { CardFilterRule, CardSortRule } from '../../types/ui';

interface IUiAction {
  type: UiActionType;
  state?: boolean;
  snackbarContent?: string;
  snackbarType?: SnackbarType;
  loadingProgress?: number;
  cardType?: ContentType | null;
  cardCourse?: CourseInfo;
  title?: string;
  url?: string;
  content?: ContentInfo;
  // CardList 排序规则
  sortRule?: CardSortRule;
  sortOrder?: 'asc' | 'desc';
  sortRuleList?: CardSortRule[];
  filterRule?: CardFilterRule;
  filterRuleList?: CardFilterRule[];
}

export type UiAction = IUiAction;

export const toggleLoginDialog = (state: boolean): UiAction => ({
  type: UiActionType.LOGIN_DIALOG_VISIBILITY,
  state,
});

export const toggleLoginDialogProgress = (state: boolean): UiAction => ({
  type: UiActionType.LOGIN_DIALOG_PROGRESS,
  state,
});

export function loginEnd() {
  return async (dispatch, getState) => {
    dispatch(toggleLoginDialog(false));
    dispatch(toggleLoginDialogProgress(false));
  };
}

export const toggleSnackbar = (state: boolean): UiAction => ({
  type: UiActionType.SNACKBAR_VISIBILITY,
  state,
});

export const togglePaneHidden = (state: boolean): UiAction => ({
  type: UiActionType.PANE_VISIBILITY,
  state,
});

export const toggleNetworkErrorDialog = (state: boolean): UiAction => ({
  type: UiActionType.NETWORK_ERROR_DIALOG_VISIBILITY,
  state,
});

export const toggleProgressBar = (state: boolean): UiAction => ({
  type: UiActionType.PROGRESS_BAR_VISIBILITY,
  state,
});

export function showSnackbar(content: string, type: SnackbarType) {
  return async (dispatch, getState) => {
    dispatch(setSnackbar(content, type));
    dispatch(toggleSnackbar(true));
  };
}

export const setSnackbar = (content: string, type: SnackbarType): UiAction => ({
  type: UiActionType.SNACKBAR_CONTENT,
  snackbarContent: content,
  snackbarType: type,
});

export const setProgressBar = (progress: number): UiAction => ({
  type: UiActionType.PROGRESS_BAR_PROGRESS,
  loadingProgress: progress,
});

export const toggleNewSemesterDialog = (state: boolean): UiAction => ({
  type: UiActionType.NEW_SEMESTER_DIALOG_VISIBILITY,
  state,
});

export const toggleLogoutDialog = (state: boolean): UiAction => ({
  type: UiActionType.TOGGLE_LOGOUT_DIALOG,
  state,
});

export const toggleIgnoreWrongSemester = (state: boolean): UiAction => ({
  type: UiActionType.IGNORE_WRONG_SEMESTER,
  state,
});

export const toggleClearDataDialog = (state: boolean): UiAction => ({
  type: UiActionType.TOGGLE_CLEAR_DATA_DIALOG,
  state,
});

export const toggleChangeSemesterDialog = (state: boolean): UiAction => ({
  type: UiActionType.TOGGLE_CHANGE_SEMESTER_DIALOG,
  state,
});

export const setCardFilter = (
  cardType?: ContentType | null,
  cardCourse?: CourseInfo,
): UiAction => ({
  type: UiActionType.CARD_FILTER,
  cardType,
  cardCourse,
});

export const setCardListTitle = (title: string): UiAction => ({
  type: UiActionType.CARD_LIST_TITLE,
  title,
});

export const addCardSelectSortRules = (
  sortRule: CardSortRule,
  sortOrder: 'asc' | 'desc',
): UiAction => ({
  type: UiActionType.CARD_SELECT_SORT_RULE,
  sortRule,
  sortOrder,
});

export const resetCardSortRule = (): UiAction => ({
  type: UiActionType.CARD_RESET_SORT_RULE,
});

export const setCardSortRuleList = (sortRuleList?: CardSortRule[]): UiAction => ({
  type: UiActionType.CARD_SET_SORT_RULE_LIST,
  sortRuleList,
});

export const selectCardFilterRule = (filterRule: CardFilterRule): UiAction => ({
  type: UiActionType.CARD_SELECT_FILTER_RULE,
  filterRule,
});

export const setCardFilterRuleList = (filterRuleList?: CardFilterRule[]): UiAction => ({
  type: UiActionType.CARD_SET_FILTER_RULE_LIST,
  filterRuleList,
});

export const loadMoreCard = (): UiAction => ({
  type: UiActionType.LOAD_MORE_CARD,
});

export const downloadAllUnreadFiles = (contents: ContentInfo[]) => async (dispatch, getState) => {
  // check login state before downloading
  const helper = (getState()[STATE_HELPER] as HelperState).helper;
  try {
    await helper.getSemesterIdList();
  } catch (e) {
    dispatch(showSnackbar('登录已过期，请刷新后重试', SnackbarType.ERROR));
    return;
  }
  for (const c of contents) {
    if (c.type === ContentType.FILE && !c.hasRead) {
      const file = c as FileInfo;
      initiateFileDownload(file.downloadUrl);
      dispatch(toggleReadState(file.id, true, ContentType.FILE));
    }
  }
};

export const setDetailUrl = (url: string): UiAction => ({
  type: UiActionType.SET_DETAIL_URL,
  url,
});

export const setDetailContent = (content: ContentInfo): UiAction => ({
  type: UiActionType.SET_DETAIL_CONTENT,
  content,
});

export const showContentIgnoreSetting = (): UiAction => ({
  type: UiActionType.SHOW_CONTENT_IGNORE_SETTING,
});

export const setTitleFilter = (title?: string): UiAction => ({
  type: UiActionType.SET_TITLE_FILTER,
  title,
});
