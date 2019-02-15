import { Dispatch } from 'redux';
import { ReactNode } from 'react';

export enum SnackbarType {
  ERROR = 'snack_bar_error',
  SUCCESS = 'snack_bar_success',
  NOTIFICATION = 'snack_bar_notification',
}

type AnyFunc = (...args: any[]) => any;

export interface ICommonDialogProps {
  open: boolean;
  title: ReactNode;
  content: ReactNode;
  firstButton: ReactNode;
  firstButtonOnClick: AnyFunc;
  secondButton?: ReactNode;
  secondButtonOnClick?: AnyFunc;
  thirdButton?: ReactNode;
  thirdButtonOnClick?: AnyFunc;
}

export interface ILoginDialogProps {
  open: boolean;
  dispatch: Dispatch<any>;
  inLoginProgress: boolean;
}
