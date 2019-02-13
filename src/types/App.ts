import { SnackbarType } from './Dialogs';
import { Dispatch } from 'redux';

interface IAppState {
  dispatch: Dispatch<any>;
  showLoadingProgressBar: boolean;
  loadingProgress: number;
  showSnackbar: boolean;
  snackbarContent: string;
  paneHidden: boolean;
  snackbarType: SnackbarType;
}

export type AppProp = IAppState;
