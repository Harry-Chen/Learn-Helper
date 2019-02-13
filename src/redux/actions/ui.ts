import { UiActionType } from './actionTypes';
import { UiState } from '../reducers/ui';
import { SnackbarType } from '../../types/Dialogs';

interface IUiAction extends Partial<UiState> {
  type: UiActionType;
}

export type UiAction = IUiAction;

export const toggleLoginDialog = (show: boolean): UiAction => {
  return {
    type: UiActionType.LOGIN_DIALOG_VISIBILITY,
    showLoginDialog: show,
  };
};

export const toggleLoginSubmit = (enable: boolean): UiAction => {
  return {
    type: UiActionType.LOGIN_DIALOG_PROGRESS,
    inLoginProgress: !enable,
  };
};

export const toggleSnackbar = (show: boolean): UiAction => {
  return {
    type: UiActionType.SNACKBAR_VISIBILITY,
    showSnackbar:show,
  };
};

export const setSnackbar = (content: string, type: SnackbarType): UiAction => {
  return {
    type: UiActionType.SNACKBAR_CONTENT,
    snackbarContent: content,
    snackbarType: type,
  };
};

export const togglePane = (hidden: boolean): UiAction => {
  return {
    type: UiActionType.PANE_VISIBILITY,
    paneHidden: hidden,
  };
};

export const toggleNetworkErrorDialog = (show: boolean): UiAction => {
  return {
    type: UiActionType.NETWORK_ERROR_DIALOG_VISIBILITY,
    showNetworkErrorDialog: show,
  };
};
