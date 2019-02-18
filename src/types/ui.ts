import { IconName } from '@fortawesome/fontawesome-common-types';
import { Dispatch } from 'redux';
import { ContentType, CourseInfo } from 'thu-learn-lib/lib/types';

import { ContentInfo } from './data';
import { SnackbarType } from './dialogs';
import { ChangeEvent } from 'react';

export interface IMenuItem {
  name: string;
  icon: IconName;
  type?: ContentType;
  handler?: (any) => any;
}

export interface IMenuItemEnum {
  [key: string]: IMenuItem;
}

interface IDispatchableComponentProps {
  dispatch?: Dispatch<any>;
}

interface ISummaryListProps extends IDispatchableComponentProps {
  numbers: {
    [key: string]: number;
  };
}

interface ICourseListProps extends IDispatchableComponentProps {
  courses: CourseInfo[];
}

interface ICardFilter {
  type: ContentType;
  course: CourseInfo;
}

interface ICardListProps extends IDispatchableComponentProps, Partial<ICardFilter> {
  contents: ContentInfo[];
  threshold: number;
  title: string;
  loadMore: () => any;
  setTitleFilter: (e: ChangeEvent<HTMLInputElement>) => any;
}

interface ICardProps extends IDispatchableComponentProps {
  content: ContentInfo;
}

export type SummaryListProps = ISummaryListProps;

export type SettingListProps = IDispatchableComponentProps;

export type CourseListProps = ICourseListProps;

export type CardListProps = ICardListProps;

export type CardProps = ICardProps;

interface IAppProps extends IDispatchableComponentProps {
  showLoadingProgressBar: boolean;
  loadingProgress: number;
  paneHidden: boolean;
}

export type AppProps = IAppProps;

interface IColoredSnackbarProps extends IDispatchableComponentProps {
  showSnackbar: boolean;
  snackbarContent: string;
  snackbarType: SnackbarType;
}

export type ColoredSnackbarProps = IColoredSnackbarProps;

interface IDetailPaneProps extends IDispatchableComponentProps {
  url: string;
  content?: ContentInfo;
  showIgnoreSettings: boolean;
}

export type DetailPaneProps = IDetailPaneProps;

interface IContentIgnoreSettingProps extends IDispatchableComponentProps {
  ignoreState: Array<{
    course: CourseInfo;
    ignore: {
      [contentType: string]: boolean;
    };
  }>;
}

export type ContentIgnoreSettingProps = IContentIgnoreSettingProps;

export type ContentDetailProps = ICardProps;
