export enum SnackbarType {
  ERROR = 'snack_bar_error',
  SUCCESS = 'snack_bar_success',
  NOTIFICATION = 'snack_bar_notification',
}

export type SnackbarSetter = (content: string, type: SnackbarType) => any;

export interface ICommonDialogProps {
  shouldOpen: boolean;
  snackbarHandler: SnackbarSetter;
}

export interface ILoginDialogProps extends ICommonDialogProps {
  loginHandler: (username: string, password: string, save: boolean) => Promise<boolean>;
}

export interface INetworkErrorDialogProps extends ICommonDialogProps {
  refreshHandler: () => any;
  offlineHandler: () => any;
}
