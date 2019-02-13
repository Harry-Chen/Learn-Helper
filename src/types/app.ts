import { SnackbarType } from './dialogs';
import { Dispatch } from 'redux';

interface IAppProp {
  dispatch: Dispatch<any>;
  showLoadingProgressBar: boolean;
  loadingProgress: number;
  showSnackbar: boolean;
  snackbarContent: string;
  paneHidden: boolean;
  snackbarType: SnackbarType;
}

export type AppProp = IAppProp;
