import type { IconName } from '@fortawesome/fontawesome-common-types';
import { ContentType } from 'thu-learn-lib';

import type { ContentInfo } from './data';
import type { AppDispatch } from '../redux/store';

export interface IMenuItem {
  name: string;
  icon: IconName;
  type?: ContentType | null;
  handler?: (dispatch: AppDispatch) => void;
}

export interface IMenuItemEnum {
  [key: string]: IMenuItem;
}

interface ICardProps {
  content: ContentInfo;
}

export type CardProps = ICardProps;

export type ColorMode = 'system' | 'light' | 'dark';
