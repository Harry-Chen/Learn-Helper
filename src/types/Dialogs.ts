import { Dispatch } from 'redux';

export enum SnackbarType {
  ERROR = 'snack_bar_error',
  SUCCESS = 'snack_bar_success',
  NOTIFICATION = 'snack_bar_notification',
}

export interface ICommonDialogProps {
  open: boolean;
  dispatch: Dispatch<any>;
}

export interface ILoginDialogProps extends ICommonDialogProps {
  submitEnabled: boolean;
}
