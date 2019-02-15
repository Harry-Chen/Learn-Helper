import { IconName } from '@fortawesome/fontawesome-common-types';
import { Dispatch } from 'redux';
import { ContentType, CourseInfo } from 'thu-learn-lib/lib/types';
import { ContentInfo } from './data';

export interface IMenuItem {
  name: string;
  icon: IconName;
  type?: ContentType;
  handler?: (any) => any;
}

export interface IMenuItemEnum {
  [key: string]: IMenuItem;
}

interface IComponent {
  classes?: any;
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

interface ICardListProps extends IDispatchableComponentProps {
  contents: ContentInfo[];
  visibility: {
    [key: string]: boolean;
  };
  title: string;
}

interface ICardProps extends IDispatchableComponentProps {
  content: ContentInfo;
  hidden: boolean;
  threshold: number;
}

export type SummaryListProps = ISummaryListProps;

export type SettingListProps = IDispatchableComponentProps;

export type CourseListProps = ICourseListProps;

export type CardListProps = ICardListProps;

export type CardProps = ICardProps;

export enum CardType {
  HOMEWORK = 'HOMEWORK',
  NOTIFICATION = 'NOTIFICATION',
  DISCUSSION = 'DISCUSSION',
  FILE = 'FILE',
  QUESTION = 'QUESTION',
}

interface ICardDataBase extends IComponent {
  type: CardType;
  course: string;
  title: string;
  date: Date;
  hasRead: boolean;
  hasStarred: boolean;
  link: string;
}

export interface IHomeworkCardData extends ICardDataBase {
  type: CardType.HOMEWORK;
  hasSubmitted: boolean;
  submitLink: string;
  fileLink?: string;
  grade?: string;
  grader?: string;
}

export interface INotificationCardData extends ICardDataBase {
  type: CardType.NOTIFICATION;
  fileLink?: string;
}

export interface IDiscussionCardData extends ICardDataBase {
  type: CardType.DISCUSSION;
}

export interface IFileCardData extends ICardDataBase {
  type: CardType.FILE;
}

export type CardData =
  | IHomeworkCardData
  | INotificationCardData
  | IDiscussionCardData
  | IFileCardData;
