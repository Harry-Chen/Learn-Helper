import { IconName } from '@fortawesome/fontawesome-common-types';

export interface IMenuItem {
  name: string;
  icon: IconName;
}

export interface IMenuItemEnum {
  [key: string]: IMenuItem;
}

export interface IComponent {
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
  items: object[];
}
