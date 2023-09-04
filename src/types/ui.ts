import type { IconName } from '@fortawesome/fontawesome-common-types';
import { ContentType } from 'thu-learn-lib';

import type { ContentInfo } from './data';

export interface IMenuItem {
  name: string;
  icon: IconName;
  type?: ContentType | null;
  handler?: (any) => any;
}

export interface IMenuItemEnum {
  [key: string]: IMenuItem;
}

interface ICardProps {
  content: ContentInfo;
}

export type CardProps = ICardProps;

export enum SnackbarType {
  ERROR = 'snack_bar_error',
  SUCCESS = 'snack_bar_success',
  NOTIFICATION = 'snack_bar_notification',
  WARNING = 'snack_bar_warning',
}
