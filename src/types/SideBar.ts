import { IconName } from '@fortawesome/fontawesome-common-types';

export interface IMenuItem {
  name: string;
  icon: IconName;
  type?: CardType;
}

export interface IMenuItemEnum {
  [key: string]: IMenuItem;
}

interface IComponent {
  classes?: any;
}

export interface IMenuData extends IMenuItem, IComponent {
  items: IMenuItem[];
}

export interface IExpandableListData extends IMenuData {
  subitems: IMenuItem[];
}

export interface INumberedListData extends IMenuData {
  numbers: object;
}

export interface ICardListData extends IComponent {
  title: string;
  items: CardData[];
}

export enum CardType {
  HOMEWORK = 'HOMEWORK',
  NOTIFICATION = 'NOTIFICATION',
  DISCUSSION = 'DISCUSSION',
  FILE = 'FILE',
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
  hasSubmitted?: boolean;
  fileLink?: string;
  grade?: string;
}

export interface INotificationCardData extends ICardDataBase {
  type: CardType.NOTIFICATION;
}

export interface IDiscussionCardData extends ICardDataBase {
  type: CardType.DISCUSSION;
}

export interface IFileCardData extends ICardDataBase {
  type: CardType.FILE;
}

export type CardData = IHomeworkCardData
    | INotificationCardData
    | IDiscussionCardData
    | IFileCardData;
