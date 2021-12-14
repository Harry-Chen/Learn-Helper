import { IconName } from '@fortawesome/fontawesome-common-types';
import { Dispatch } from 'redux';
import { ContentType, CourseInfo } from 'thu-learn-lib/lib/types';

import { ContentInfo } from './data';
import { SnackbarType } from './dialogs';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface IMenuItem {
  name: string;
  icon: IconName;
  type?: ContentType | null;
  handler?: (any) => any;
  filterRules?: CardFilterRule[];
  sortRules?: CardSortRule[];
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

// card 排序规则
interface ICardSortRule {
  // 规则名称
  name: string;
  // 排序 key 指定函数
  func: (content: ContentInfo) => number | string | Date;
  // fontAwesome 的图标名称
  iconName?: IconProp;
}

export type CardSortRule = ICardSortRule;

// card 排序中的过滤规则
interface ICardFilterRule {
  // 规则名称
  name: string;
  // 过滤 key 指定函数，返回 true 则为通过
  func: (content: ContentInfo) => boolean;
  // fontAwesome 的图标名称
  iconName?: string;
}

export type CardFilterRule = ICardFilterRule;

interface ICardListProps extends IDispatchableComponentProps, Partial<ICardFilter> {
  contents: ContentInfo[];
  threshold: number;
  unreadFileCount: number;
  loadMore: () => any;
  downloadAllUnread: (contents: ContentInfo[]) => any;
  filterRules?: CardFilterRule[];
  sortRules: CardSortRule[] | undefined;
  sortOrders?: ('asc' | 'desc')[];
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
  cardListTitle: string;
  semesterTitle: string;
  latestSemester: boolean;
  cardSortRuleList: CardSortRule[];
  cardSelectSortRules: CardSortRule[];
  cardSelectSortOrders: ('asc' | 'desc')[];
  cardFilterRuleList?: CardFilterRule[];
  cardSelectFilterRules?: CardFilterRule[];
  openSidebar: () => any;
  closeSidebar: () => any;
  resetApp: () => any;
  setTitleFilter: (filter: string) => any;
  openChangeSemesterDialog: () => any;
  addCardSortRule: (rule: CardSortRule, ord: 'asc' | 'desc') => any;
  resetCardSortRule: () => any;
  selectCardFilterRule: (rule: CardFilterRule) => any;
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
  csrfToken: string;
}

export type DetailPaneProps = IDetailPaneProps;

interface IContentIgnoreSettingProps extends IDispatchableComponentProps {
  ignoreState: {
    course: CourseInfo;
    ignore: {
      [contentType: string]: boolean;
    };
  }[];
}

export type ContentIgnoreSettingProps = IContentIgnoreSettingProps;

interface IContentDetailProps extends ICardProps {
  csrfToken: string;
}

export type ContentDetailProps = IContentDetailProps;
