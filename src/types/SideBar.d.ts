import { IconName } from '@fortawesome/fontawesome-common-types';

interface IMenuItem {
  name: string;
  icon: IconName;
}

interface IMenuData extends IMenuItem {
  classes?: any;
  items: IMenuItem[];
}

interface IExpandableListData extends IMenuData {
  subitems: IMenuItem[];
}

interface INumberedListData extends IMenuData {
  numbers: object;
}

export { IExpandableListData, INumberedListData };
