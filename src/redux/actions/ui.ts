import { UiActionType } from './actionTypes';
import { SnackbarType } from '../../types/dialogs';

interface IUiAction {
  type: UiActionType;
  state?: boolean;
  snackbarContent?: string;
  snackbarType?: SnackbarType;
  loadingProgress?: number;
}

export type UiAction = IUiAction;

export const toggleLoginDialog = (state: boolean): UiAction => {
  return {
    type: UiActionType.LOGIN_DIALOG_VISIBILITY,
    state,
  };
};

export const toggleLoginSubmit = (state: boolean): UiAction => {
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
