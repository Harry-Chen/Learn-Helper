import type { IconName } from '@fortawesome/fontawesome-common-types';
import { ContentType } from 'thu-learn-lib';
import { msg } from '@lingui/macro';
import type { MessageDescriptor } from '@lingui/core';

import {
  refresh,
  setDetailPage,
  toggleClearDataDialog,
  toggleLogoutDialog,
  toggleChangeSemesterDialog,
  markAllRead,
} from '../redux/actions';
import type { AppDispatch } from '../redux/store';

export const COURSE_MAIN_FUNC = {
  [ContentType.NOTIFICATION]: {
    type: ContentType.NOTIFICATION,
    icon: 'bullhorn',
    name: msg`公告`,
  },
  [ContentType.FILE]: {
    type: ContentType.FILE,
    icon: 'download',
    name: msg`文件`,
  },
  [ContentType.HOMEWORK]: {
    type: ContentType.HOMEWORK,
    icon: 'pencil-alt',
    name: msg`作业`,
  },
  [ContentType.DISCUSSION]: {
    type: ContentType.DISCUSSION,
    icon: 'question',
    name: msg`讨论`,
  },
  [ContentType.QUESTION]: {
    type: ContentType.QUESTION,
    icon: 'chalkboard-teacher',
    name: msg`答疑`,
  },
} as const;

export interface IMenuItem {
  name: MessageDescriptor;
  icon: IconName;
  type?: ContentType | null;
}

export const COURSE_ICON: IconName = 'book';

export const COURSE_FUNC_LIST: IMenuItem[] = [
  {
    icon: 'info-circle',
    name: msg`课程综合`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.NOTIFICATION],
    name: msg`课程公告`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.FILE],
    name: msg`课程文件`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.HOMEWORK],
    name: msg`课程作业`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.DISCUSSION],
    name: msg`课程讨论`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.QUESTION],
    name: msg`课程答疑`,
  },
  {
    type: null,
    icon: 'external-link-alt',
    name: msg`课程主页`,
  },
];

export const SUMMARY_FUNC_LIST: IMenuItem[] = [
  {
    icon: 'home',
    name: msg`主页`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.HOMEWORK],
    name: msg`所有作业`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.NOTIFICATION],
    name: msg`所有公告`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.FILE],
    name: msg`所有文件`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.DISCUSSION],
    name: msg`所有讨论`,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.QUESTION],
    name: msg`所有答疑`,
  },
  {
    type: null,
    icon: 'trash',
    name: msg`所有忽略`,
  },
];

export interface ISettingItem {
  name: MessageDescriptor;
  icon: IconName;
  handler?: (dispatch: AppDispatch) => void;
}

export const SETTINGS_FUNC_LIST: ISettingItem[] = [
  {
    icon: 'ban',
    name: msg`管理隐藏项`,
    handler: (dispatch: AppDispatch) => {
      dispatch(setDetailPage('content-ignore-setting'));
    },
  },
  {
    icon: 'envelope-open',
    name: msg`标记为已读`,
    handler: (dispatch: AppDispatch) => {
      dispatch(markAllRead());
    },
  },
  {
    icon: 'sync',
    name: msg`手动刷新`,
    handler: (dispatch: AppDispatch) => {
      dispatch(refresh());
    },
  },
  {
    icon: 'random',
    name: msg`切换学期`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleChangeSemesterDialog(true));
    },
  },
  {
    icon: 'trash',
    name: msg`清空缓存`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleClearDataDialog(true));
    },
  },
  {
    icon: 'user',
    name: msg`退出登录`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleLogoutDialog(true));
    },
  },
];
