import { IconName } from '@fortawesome/fontawesome-common-types';

import { IMenuItem, IMenuItemEnum } from '../types/sidebar';
import { Dispatch } from 'redux';
import { refresh } from '../redux/actions/helper';
import { toggleClearDataDialog, toggleLogoutDialog } from '../redux/actions/ui';
import { ContentType } from 'thu-learn-lib/lib/types';

export const COURSE_MAIN_FUNC_LIST: {
  [key: string]: {
    icon: IconName;
    name: string;
    type: ContentType;
  };
} = {
  NOTIFICATION: {
    icon: 'bullhorn',
    name: '通知',
    type: ContentType.NOTIFICATION,
  },
  FILE: {
    icon: 'download',
    name: '文件',
    type: ContentType.FILE,
  },
  HOMEWORK: {
    icon: 'pencil-alt',
    name: '作业',
    type: ContentType.HOMEWORK,
  },
  DISCUSSION: {
    icon: 'question',
    name: '讨论',
    type: ContentType.DISCUSSION,
  },
  QUESTION: {
    icon: 'chalkboard-teacher',
    name: '答疑',
    type: ContentType.QUESTION,
  },
};

export const COURSE_ICON: IconName = 'book';

const COURSE_FUNC: IMenuItemEnum = {
  COURSE_NOTIFICATION: {
    icon: COURSE_MAIN_FUNC_LIST.NOTIFICATION.icon,
    name: '课程公告',
    type: ContentType.NOTIFICATION,
  },
  COURSE_INFORMATION: {
    icon: 'info-circle',
    name: '课程信息',
  },
  COURSE_FILES: {
    icon: COURSE_MAIN_FUNC_LIST.FILE.icon,
    name: '课程文件',
    type: ContentType.FILE,
  },
  COURSE_HOMEWORK: {
    icon: COURSE_MAIN_FUNC_LIST.HOMEWORK.icon,
    name: '课程作业',
    type: ContentType.HOMEWORK,
  },
  COURSE_DISCUSSION: {
    icon: COURSE_MAIN_FUNC_LIST.DISCUSSION.icon,
    name: '课程讨论',
    type: ContentType.DISCUSSION,
  },
  COURSE_QUESTION: {
    icon: COURSE_MAIN_FUNC_LIST.QUESTION.icon,
    name: '课程答疑',
    type: ContentType.QUESTION,
  },
  COURSE_HOMEPAGE: {
    icon: 'external-link-alt',
    name: '课程主页（新窗口）',
  },
};

export const COURSE_FUNC_LIST: IMenuItem[] = [
  COURSE_FUNC.COURSE_NOTIFICATION,
  // COURSE_FUNC.COURSE_INFORMATION,
  COURSE_FUNC.COURSE_FILES,
  COURSE_FUNC.COURSE_HOMEWORK,
  COURSE_FUNC.COURSE_DISCUSSION,
  COURSE_FUNC.COURSE_HOMEPAGE,
];

const SUMMARY_FUNC: IMenuItemEnum = {
  SUMMARY_HOMEPAGE: {
    icon: 'home',
    name: '主页',
  },
  SUMMARY_HOMEWORK: {
    icon: COURSE_MAIN_FUNC_LIST.HOMEWORK.icon,
    name: '所有作业',
    type: ContentType.HOMEWORK,
  },
  SUMMARY_NOTIFICATIONS: {
    icon: COURSE_MAIN_FUNC_LIST.NOTIFICATION.icon,
    name: '所有通知',
    type: ContentType.NOTIFICATION,
  },
  SUMMARY_FILES: {
    icon: COURSE_MAIN_FUNC_LIST.FILE.icon,
    name: '所有文件',
    type: ContentType.FILE,
  },
  SUMMARY_DISCUSSIONS: {
    icon: COURSE_MAIN_FUNC_LIST.DISCUSSION.icon,
    name: '所有讨论',
    type: ContentType.DISCUSSION,
  },
  SUMMARY_QUESTIONS: {
    icon: COURSE_MAIN_FUNC_LIST.QUESTION.icon,
    name: '所有答疑',
    type: ContentType.QUESTION,
  },
};

export const SUMMARY_FUNC_LIST: IMenuItem[] = [
  SUMMARY_FUNC.SUMMARY_HOMEPAGE,
  SUMMARY_FUNC.SUMMARY_HOMEWORK,
  SUMMARY_FUNC.SUMMARY_NOTIFICATIONS,
  SUMMARY_FUNC.SUMMARY_FILES,
  SUMMARY_FUNC.SUMMARY_DISCUSSIONS,
  SUMMARY_FUNC.SUMMARY_QUESTIONS,
];

const SETTINGS_FUNC: IMenuItemEnum = {
  SETTINGS_IGNORE: {
    icon: 'cog',
    name: '管理忽略项',
    handler: (dispatch: Dispatch<any>) => {
      // dispatch();
      // show manage page
    },
  },
  SETTINGS_MARK_READ: {
    icon: 'envelope',
    name: '全部标为已读',
    handler: (dispatch: Dispatch<any>) => {

    },
  },
  SETTINGS_REFRESH: {
    icon: 'sync',
    name: '手动刷新',
    handler: (dispatch: Dispatch<any>) => {
      dispatch(refresh());
    },
  },
  SETTINGS_CHANGE_USER: {
    icon: 'user',
    name: '退出登录',
    handler: (dispatch: Dispatch<any>) => {
      dispatch(toggleLogoutDialog(true));
    },
  },
  SETTINGS_CLEAR_CACHE: {
    icon: 'trash',
    name: '清空缓存',
    handler: (dispatch: Dispatch<any>) => {
      dispatch(toggleClearDataDialog(true));
    },
  },
};

export const SETTINGS_FUNC_LIST: IMenuItem[] = [
  SETTINGS_FUNC.SETTINGS_IGNORE,
  SETTINGS_FUNC.SETTINGS_MARK_READ,
  SETTINGS_FUNC.SETTINGS_REFRESH,
  SETTINGS_FUNC.SETTINGS_CLEAR_CACHE,
  SETTINGS_FUNC.SETTINGS_CHANGE_USER,
];
