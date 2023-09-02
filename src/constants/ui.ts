import type { IconName } from '@fortawesome/fontawesome-common-types';

import { ContentType } from 'thu-learn-lib/lib/types';
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
import { t } from '../utils/i18n';

export const COURSE_MAIN_FUNC: {
  [key: string]: {
    icon: IconName;
    name: string;
    type: ContentType;
  };
} = {
  [ContentType.NOTIFICATION]: {
    icon: 'bullhorn',
    name: t('Content_Notification'),
    type: ContentType.NOTIFICATION,
  },
  [ContentType.FILE]: {
    icon: 'download',
    name: t('Content_File'),
    type: ContentType.FILE,
  },
  [ContentType.HOMEWORK]: {
    icon: 'pencil-alt',
    name: t('Content_Homework'),
    type: ContentType.HOMEWORK,
  },
  [ContentType.DISCUSSION]: {
    icon: 'question',
    name: t('Content_Discussion'),
    type: ContentType.DISCUSSION,
  },
  [ContentType.QUESTION]: {
    icon: 'chalkboard-teacher',
    name: t('Content_Question'),
    type: ContentType.QUESTION,
  },
};

export const COURSE_ICON: IconName = 'book';

export const COURSE_FUNC: IMenuItemEnum = {
  COURSE_NOTIFICATION: {
    icon: COURSE_MAIN_FUNC[ContentType.NOTIFICATION].icon,
    name: t('Course_Notification'),
    type: ContentType.NOTIFICATION,
  },
  COURSE_SUMMARY: {
    icon: 'info-circle',
    name: t('Course_Summary'),
  },
  COURSE_FILE: {
    icon: COURSE_MAIN_FUNC[ContentType.FILE].icon,
    name: t('Course_File'),
    type: ContentType.FILE,
  },
  COURSE_HOMEWORK: {
    icon: COURSE_MAIN_FUNC[ContentType.HOMEWORK].icon,
    name: t('Course_Homework'),
    type: ContentType.HOMEWORK,
  },
  COURSE_DISCUSSION: {
    icon: COURSE_MAIN_FUNC[ContentType.DISCUSSION].icon,
    name: t('Course_Discussion'),
    type: ContentType.DISCUSSION,
  },
  COURSE_QUESTION: {
    icon: COURSE_MAIN_FUNC[ContentType.QUESTION].icon,
    name: t('Course_Question'),
    type: ContentType.QUESTION,
  },
  COURSE_HOMEPAGE: {
    icon: 'external-link-alt',
    name: t('Course_Homepage'),
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
    name: t('Summary_Homepage'),
  },
  SUMMARY_HOMEWORK: {
    icon: COURSE_MAIN_FUNC[ContentType.HOMEWORK].icon,
    name: t('Summary_Homework'),
    type: ContentType.HOMEWORK,
  },
  SUMMARY_NOTIFICATION: {
    icon: COURSE_MAIN_FUNC[ContentType.NOTIFICATION].icon,
    name: t('Summary_Notification'),
    type: ContentType.NOTIFICATION,
  },
  SUMMARY_FILE: {
    icon: COURSE_MAIN_FUNC[ContentType.FILE].icon,
    name: t('Summary_File'),
    type: ContentType.FILE,
  },
  SUMMARY_DISCUSSION: {
    icon: COURSE_MAIN_FUNC[ContentType.DISCUSSION].icon,
    name: t('Summary_Discussion'),
    type: ContentType.DISCUSSION,
  },
  SUMMARY_QUESTION: {
    icon: COURSE_MAIN_FUNC[ContentType.QUESTION].icon,
    name: t('Summary_Question'),
    type: ContentType.QUESTION,
  },
  SUMMARY_IGNORED: {
    icon: 'trash',
    name: t('Summary_Ignored'),
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
    name: t('Settings_ManageIgnored'),
    handler: (dispatch: AppDispatch) => {
      dispatch(setDetailPage('content-ignore-setting'));
    },
  },
  SETTINGS_MARK_READ: {
    icon: 'envelope-open',
    name: t('Settings_MarkAllAsRead'),
    handler: (dispatch: AppDispatch) => {
      dispatch(markAllRead());
    },
  },
  SETTINGS_REFRESH: {
    icon: 'sync',
    name: t('Settings_Refresh'),
    handler: (dispatch: AppDispatch) => {
      dispatch(refresh());
    },
  },
  SETTINGS_CHANGE_SEMESTER: {
    icon: 'random',
    name: t('ChangeSemesterDialog_Title'),
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleChangeSemesterDialog(true));
    },
  },
  SETTINGS_CHANGE_USER: {
    icon: 'user',
    name: t('LogoutDialog_Title'),
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleLogoutDialog(true));
    },
  },
  SETTINGS_CLEAR_CACHE: {
    icon: 'trash',
    name: t('Settings_ClearCache'),
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
