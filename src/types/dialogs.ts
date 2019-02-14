import { Dispatch } from 'redux';
import { SemesterInfo } from 'thu-learn-lib/lib/types';

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
  inLoginProgress: boolean;
}

export interface INewSemesterDialogProps extends ICommonDialogProps {
  currentSemester: SemesterInfo;
  newSemester: SemesterInfo;
}
