import type { IconName } from '@fortawesome/fontawesome-common-types';
import { ContentType } from 'thu-learn-lib';
import { t } from '@lingui/macro';

import type { IMenuItem, IMenuItemEnum } from '../types/ui';
import {
  refresh,
  setDetailPage,
  toggleClearDataDialog,
  toggleLogoutDialog,
  toggleChangeSemesterDialog,
  markAllRead,
} from '../redux/actions';
import type { AppDispatch } from '../redux/store';

export const COURSE_MAIN_FUNC: {
  [key: string]: {
    icon: IconName;
    name: string;
    type: ContentType;
  };
} = {
  [ContentType.NOTIFICATION]: {
    icon: 'bullhorn',
    name: t`公告`,
    type: ContentType.NOTIFICATION,
  },
  [ContentType.FILE]: {
    icon: 'download',
    name: t`文件`,
    type: ContentType.FILE,
  },
  [ContentType.HOMEWORK]: {
    icon: 'pencil-alt',
    name: t`作业`,
    type: ContentType.HOMEWORK,
  },
  [ContentType.DISCUSSION]: {
    icon: 'question',
    name: t`讨论`,
    type: ContentType.DISCUSSION,
  },
  [ContentType.QUESTION]: {
    icon: 'chalkboard-teacher',
    name: t`答疑`,
    type: ContentType.QUESTION,
  },
};

export const COURSE_ICON: IconName = 'book';

export const COURSE_FUNC: IMenuItemEnum = {
  COURSE_SUMMARY: {
    icon: 'info-circle',
    name: t`课程综合`,
  },
  COURSE_NOTIFICATION: {
    icon: COURSE_MAIN_FUNC[ContentType.NOTIFICATION].icon,
    name: t`课程公告`,
    type: ContentType.NOTIFICATION,
  },
  COURSE_FILE: {
    icon: COURSE_MAIN_FUNC[ContentType.FILE].icon,
    name: t`课程文件`,
    type: ContentType.FILE,
  },
  COURSE_HOMEWORK: {
    icon: COURSE_MAIN_FUNC[ContentType.HOMEWORK].icon,
    name: t`课程作业`,
    type: ContentType.HOMEWORK,
  },
  COURSE_DISCUSSION: {
    icon: COURSE_MAIN_FUNC[ContentType.DISCUSSION].icon,
    name: t`课程讨论`,
    type: ContentType.DISCUSSION,
  },
  COURSE_QUESTION: {
    icon: COURSE_MAIN_FUNC[ContentType.QUESTION].icon,
    name: t`课程答疑`,
    type: ContentType.QUESTION,
  },
  COURSE_HOMEPAGE: {
    icon: 'external-link-alt',
    name: t`课程主页`,
  },
};

export const COURSE_FUNC_LIST: IMenuItem[] = [
  COURSE_FUNC.COURSE_SUMMARY,
  COURSE_FUNC.COURSE_NOTIFICATION,
  COURSE_FUNC.COURSE_FILE,
  COURSE_FUNC.COURSE_HOMEWORK,
  COURSE_FUNC.COURSE_DISCUSSION,
  COURSE_FUNC.COURSE_QUESTION,
  COURSE_FUNC.COURSE_HOMEPAGE,
];

const SUMMARY_FUNC: IMenuItemEnum = {
  SUMMARY_HOMEPAGE: {
    icon: 'home',
    name: t`主页`,
  },
  SUMMARY_HOMEWORK: {
    icon: COURSE_MAIN_FUNC[ContentType.HOMEWORK].icon,
    name: t`所有作业`,
    type: ContentType.HOMEWORK,
  },
  SUMMARY_NOTIFICATION: {
    icon: COURSE_MAIN_FUNC[ContentType.NOTIFICATION].icon,
    name: t`所有公告`,
    type: ContentType.NOTIFICATION,
  },
  SUMMARY_FILE: {
    icon: COURSE_MAIN_FUNC[ContentType.FILE].icon,
    name: t`所有文件`,
    type: ContentType.FILE,
  },
  SUMMARY_DISCUSSION: {
    icon: COURSE_MAIN_FUNC[ContentType.DISCUSSION].icon,
    name: t`所有讨论`,
    type: ContentType.DISCUSSION,
  },
  SUMMARY_QUESTION: {
    icon: COURSE_MAIN_FUNC[ContentType.QUESTION].icon,
    name: t`所有答疑`,
    type: ContentType.QUESTION,
  },
  SUMMARY_IGNORED: {
    icon: 'trash',
    name: t`所有忽略`,
    type: null,
  },
};

export const SUMMARY_FUNC_LIST: IMenuItem[] = [
  SUMMARY_FUNC.SUMMARY_HOMEPAGE,
  SUMMARY_FUNC.SUMMARY_HOMEWORK,
  SUMMARY_FUNC.SUMMARY_NOTIFICATION,
  SUMMARY_FUNC.SUMMARY_FILE,
  SUMMARY_FUNC.SUMMARY_DISCUSSION,
  SUMMARY_FUNC.SUMMARY_QUESTION,
  SUMMARY_FUNC.SUMMARY_IGNORED,
];

const SETTINGS_FUNC: IMenuItemEnum = {
  SETTINGS_IGNORE: {
    icon: 'ban',
    name: t`管理隐藏项`,
    handler: (dispatch: AppDispatch) => {
      dispatch(setDetailPage('content-ignore-setting'));
    },
  },
  SETTINGS_MARK_READ: {
    icon: 'envelope-open',
    name: t`标记为已读`,
    handler: (dispatch: AppDispatch) => {
      dispatch(markAllRead());
    },
  },
  SETTINGS_REFRESH: {
    icon: 'sync',
    name: t`手动刷新`,
    handler: (dispatch: AppDispatch) => {
      dispatch(refresh());
    },
  },
  SETTINGS_CHANGE_SEMESTER: {
    icon: 'random',
    name: t`切换学期`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleChangeSemesterDialog(true));
    },
  },
  SETTINGS_CHANGE_USER: {
    icon: 'user',
    name: t`退出登录`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleLogoutDialog(true));
    },
  },
  SETTINGS_CLEAR_CACHE: {
    icon: 'trash',
    name: t`清空缓存`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleClearDataDialog(true));
    },
  },
};

export const SETTINGS_FUNC_LIST: IMenuItem[] = [
  SETTINGS_FUNC.SETTINGS_IGNORE,
  SETTINGS_FUNC.SETTINGS_MARK_READ,
  SETTINGS_FUNC.SETTINGS_REFRESH,
  SETTINGS_FUNC.SETTINGS_CHANGE_SEMESTER,
  SETTINGS_FUNC.SETTINGS_CLEAR_CACHE,
  SETTINGS_FUNC.SETTINGS_CHANGE_USER,
];
