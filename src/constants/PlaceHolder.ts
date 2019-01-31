import { IconName } from '@fortawesome/fontawesome-common-types';

import { CardData, CardType } from '../types/SideBar';

export const TEST_COURSE_LIST = [
  {
    icon: 'home' as IconName,
    name: '测试',
  },  {
    icon: 'home' as IconName,
    name: '测试2',
},
];

export const TEST_CARD_INFO_LIST: CardData[] = [
  {
    type: CardType.FILE,
    date: new Date(1998, 0, 29),
    course: '23导论',
    title: '我很的很菜',
    hasRead: false,
    hasStarred: true,
    link: 'about.html?1',
  },
  {
    type: CardType.HOMEWORK,
    date: new Date(1926, 7, 17),
    title: '背诵《赴戍登程口占示家人》',
    course: '膜蛤原理',
    hasRead: false,
    hasStarred: false,
    link: 'about.html?2',
    hasSubmitted: false,
    grade: '100',
    fileLink: 'changelog.html',
  },
  {
    type: CardType.DISCUSSION,
    date: new Date(2018, 11, 31),
    course: '杰学入门',
    title: '我怎么才能像杰哥一样强',
    hasRead: true,
    hasStarred: false,
    link: 'about.html?3',
  },
  {
    type: CardType.NOTIFICATION,
    date: new Date(9102, 1, 1),
    course: '贵系生存基础',
    title: '明天进入三周阶段',
    hasRead: true,
    hasStarred: false,
    link: 'about.html?4',
  },
];
