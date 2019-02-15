import { UiActionType } from './actionTypes';
import { SnackbarType } from '../../types/dialogs';
import { ContentType, CourseInfo } from 'thu-learn-lib/lib/types';

interface IUiAction {
  type: UiActionType;
  state?: boolean;
  snackbarContent?: string;
  snackbarType?: SnackbarType;
  loadingProgress?: number;
  cardType?: ContentType;
  cardCourse?: CourseInfo;
  title?: string;
}

export type UiAction = IUiAction;

export const toggleLoginDialog = (state: boolean): UiAction => {
  return {
    type: UiActionType.LOGIN_DIALOG_VISIBILITY,
    state,
  };
};

export const toggleLoginDialogProgress = (state: boolean): UiAction => {
  return {
    type: UiActionType.LOGIN_DIALOG_PROGRESS,
    state,
  };
};

export const toggleSnackbar = (state: boolean): UiAction => {
  return {
    type: UiActionType.SNACKBAR_VISIBILITY,
    state,
  };
};

export const togglePane = (state: boolean): UiAction => {
  return {
    type: UiActionType.PANE_VISIBILITY,
    state,
  };
};

export const toggleNetworkErrorDialog = (state: boolean): UiAction => {
  return {
    type: UiActionType.NETWORK_ERROR_DIALOG_VISIBILITY,
    state,
  };
};

export const toggleProgressBar = (state: boolean): UiAction => {
  return {
    type: UiActionType.PROGRESS_BAR_VISIBILITY,
    state,
  };
};

export const setSnackbar = (content: string, type: SnackbarType): UiAction => {
  return {
    type: UiActionType.SNACKBAR_CONTENT,
    snackbarContent: content,
    snackbarType: type,
  };
};

export const setProgressBar = (progress: number): UiAction => {
  return {
    type: UiActionType.PROGRESS_BAR_PROGRESS,
    loadingProgress: progress,
  };
};

export const toggleNewSemesterDialog = (state: boolean): UiAction => {
  return {
    type: UiActionType.NEW_SEMESTER_DIALOG_VISIBILITY,
    state,
  };
};

export const toggleLogoutDialog = (state: boolean): UiAction => {
  return {
    type: UiActionType.TOGGLE_LOGOUT_DIALOG,
    state,
  };
};

export const toggleClearDataDialog = (state: boolean): UiAction => {
  return {
    type: UiActionType.TOGGLE_CLEAR_DATA_DIALOG,
    state,
  };
};

export const toggleIgnoreWrongSemester = (state: boolean): UiAction => {
  return {
    type: UiActionType.IGNORE_WRONG_SEMESTER,
    state,
  };
};

export const setCardFilter = (cardType?: ContentType, cardCourse?: CourseInfo): UiAction => {
  return {
    type: UiActionType.CARD_FILTER,
    cardType,
    cardCourse,
  };
};

export const setCardListTitle = (title: string): UiAction => {
  return {
    type: UiActionType.CARD_LIST_TITLE,
    title,
  };
};

export const loadMoreCard = (): UiAction => {
  return {
    type: UiActionType.LOAD_MORE_CARD,
  };
}
