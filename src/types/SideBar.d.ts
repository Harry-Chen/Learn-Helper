import { IconName } from '@fortawesome/fontawesome-common-types';

interface IMenuItem {
  name: string;
  icon: IconName;
}

interface IComponent {
  classes?: any;
}

interface IMenuData extends IMenuItem, IComponent {
  items: IMenuItem[];
}

interface IExpandableListData extends IMenuData {
  subitems: IMenuItem[];
}

interface INumberedListData extends IMenuData {
  numbers: object;
}

interface ICardListData extends IComponent {
  title: string;
  items: object[];
}

export { IExpandableListData, INumberedListData, ICardListData };
