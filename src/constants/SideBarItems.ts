import { IMenuItem, IMenuItemEnum } from '../types/SideBar';

const COURSE_FUNC: IMenuItemEnum = {
  COURSE_NOTIFICATION: {
    icon: 'bullhorn',
    name: '课程公告',
  },
  COURSE_INFORMATION: {
    icon: 'info-circle',
    name: '课程信息',
  },
  COURSE_FILES: {
    icon: 'download',
    name: '课程文件',
  },
  COURSE_HOMEWORK: {
    icon: 'pencil-alt',
    name: '课程作业',
  },
  COURSE_DISCUSSION: {
    icon: 'question',
    name: '课程讨论',
  },
  COURSE_HOMEPAGE: {
    icon: 'external-link-alt',
    name: '课程主页（新窗口）',
  },
};

export const COURSE_FUNC_LIST: IMenuItem[] = [
  COURSE_FUNC.COURSE_NOTIFICATION,
  COURSE_FUNC.COURSE_INFORMATION,
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
    icon: 'pencil-alt',
    name: '所有作业',
  },
  SUMMARY_NOTIFICATIONS: {
    icon: 'bullhorn',
    name: '所有通知',
  },
  SUMMARY_FILES: {
    icon: 'download',
    name: '所有文件',
  },
  SUMMARY_DISCUSSIONS: {
    icon: 'question',
    name: '所有讨论',
  },
};

export const SUMMARY_FUNC_LIST: IMenuItem[] = [
  SUMMARY_FUNC.SUMMARY_HOMEPAGE,
  SUMMARY_FUNC.SUMMARY_HOMEWORK,
  SUMMARY_FUNC.SUMMARY_NOTIFICATIONS,
  SUMMARY_FUNC.SUMMARY_FILES,
  SUMMARY_FUNC.SUMMARY_DISCUSSIONS,
];

const SETTINGS_FUNC: IMenuItemEnum = {
  SETTINGS_IGNORE: {
    icon: 'cog',
    name: '管理忽略项',
  },
  SETTINGS_MARK_READ: {
    icon: 'envelope',
    name: '全部标为已读',
  },
  SETTINGS_REFRESH: {
    icon: 'sync',
    name: '强制刷新',
  },
  SETTINGS_CHANGE_USER: {
    icon: 'user',
    name: '退出登录',
  },
  SETTINGS_CLEAR_CACHE: {
    icon: 'trash',
    name: '清空缓存',
  },
};

export const SETTINGS_FUNC_LIST: IMenuItem[] = [
  SETTINGS_FUNC.SETTINGS_IGNORE,
  SETTINGS_FUNC.SETTINGS_MARK_READ,
  SETTINGS_FUNC.SETTINGS_REFRESH,
  SETTINGS_FUNC.SETTINGS_CHANGE_USER,
  SETTINGS_FUNC.SETTINGS_CLEAR_CACHE,
];
