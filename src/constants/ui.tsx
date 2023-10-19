import React from 'react';
import { ContentType } from 'thu-learn-lib';
import { msg } from '@lingui/macro';

import IconBullhorn from '~icons/fa6-solid/bullhorn';
import IconDownload from '~icons/fa6-solid/download';
import IconPencil from '~icons/fa6-solid/pencil';
import IconQuestion from '~icons/fa6-solid/question';
import IconChalkboardUser from '~icons/fa6-solid/chalkboard-user';
import IconCircleInfo from '~icons/fa6-solid/circle-info';
import IconUpRightFromSquare from '~icons/fa6-solid/up-right-from-square';
import IconHouse from '~icons/fa6-solid/house';
import IconTrash from '~icons/fa6-solid/trash';
import IconBan from '~icons/fa6-solid/ban';
import IconEnvelopeOpen from '~icons/fa6-solid/envelope-open';
import IconArrowsRotate from '~icons/fa6-solid/arrows-rotate';
import IconShuffle from '~icons/fa6-solid/shuffle';
import IconUser from '~icons/fa6-solid/user';

import {
  refresh,
  setDetailPage,
  toggleClearDataDialog,
  toggleLogoutDialog,
  toggleChangeSemesterDialog,
  markAllRead,
} from '../redux/actions';
import type { AppDispatch } from '../redux/store';

export type TUIFunc = ContentType | 'summary' | 'ignored' | 'homepage';

export const UI_NAME_SUMMARY = {
  summary: msg`主页`,
  [ContentType.NOTIFICATION]: msg`所有公告`,
  [ContentType.FILE]: msg`所有文件`,
  [ContentType.HOMEWORK]: msg`所有作业`,
  [ContentType.DISCUSSION]: msg`所有讨论`,
  [ContentType.QUESTION]: msg`所有答疑`,
  ignored: msg`所有忽略`,
} as const;

export const UI_NAME_COURSE = {
  summary: msg`课程综合`,
  [ContentType.NOTIFICATION]: msg`课程公告`,
  [ContentType.FILE]: msg`课程文件`,
  [ContentType.HOMEWORK]: msg`课程作业`,
  [ContentType.DISCUSSION]: msg`课程讨论`,
  [ContentType.QUESTION]: msg`课程答疑`,
  homepage: msg`课程主页`,
} as const;

export const COURSE_MAIN_FUNC = {
  [ContentType.NOTIFICATION]: {
    type: ContentType.NOTIFICATION,
    icon: <IconBullhorn />,
    name: msg`公告`,
  },
  [ContentType.FILE]: {
    type: ContentType.FILE,
    icon: <IconDownload />,
    name: msg`文件`,
  },
  [ContentType.HOMEWORK]: {
    type: ContentType.HOMEWORK,
    icon: <IconPencil />,
    name: msg`作业`,
  },
  [ContentType.DISCUSSION]: {
    type: ContentType.DISCUSSION,
    icon: <IconQuestion />,
    name: msg`讨论`,
  },
  [ContentType.QUESTION]: {
    type: ContentType.QUESTION,
    icon: <IconChalkboardUser />,
    name: msg`答疑`,
  },
} as const;

export const COURSE_FUNC_LIST = [
  {
    type: undefined,
    icon: <IconCircleInfo />,
    name: UI_NAME_COURSE.summary,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.NOTIFICATION],
    name: UI_NAME_COURSE[ContentType.NOTIFICATION],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.FILE],
    name: UI_NAME_COURSE[ContentType.FILE],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.HOMEWORK],
    name: UI_NAME_COURSE[ContentType.HOMEWORK],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.DISCUSSION],
    name: UI_NAME_COURSE[ContentType.DISCUSSION],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.QUESTION],
    name: UI_NAME_COURSE[ContentType.QUESTION],
  },
  {
    type: 'homepage',
    icon: <IconUpRightFromSquare />,
    name: UI_NAME_COURSE.homepage,
  },
] as const;

export const SUMMARY_FUNC_LIST = [
  {
    type: undefined,
    icon: <IconHouse />,
    name: UI_NAME_SUMMARY.summary,
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.HOMEWORK],
    name: UI_NAME_SUMMARY[ContentType.HOMEWORK],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.NOTIFICATION],
    name: UI_NAME_SUMMARY[ContentType.NOTIFICATION],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.FILE],
    name: UI_NAME_SUMMARY[ContentType.FILE],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.DISCUSSION],
    name: UI_NAME_SUMMARY[ContentType.DISCUSSION],
  },
  {
    ...COURSE_MAIN_FUNC[ContentType.QUESTION],
    name: UI_NAME_SUMMARY[ContentType.QUESTION],
  },
  {
    type: 'ignored',
    icon: <IconTrash />,
    name: UI_NAME_SUMMARY.ignored,
  },
] as const;

export const SETTINGS_FUNC_LIST = [
  {
    icon: <IconBan />,
    name: msg`管理隐藏项`,
    handler: (dispatch: AppDispatch) => {
      dispatch(setDetailPage('content-ignore-setting'));
    },
  },
  {
    icon: <IconEnvelopeOpen />,
    name: msg`全部标记已读`,
    handler: (dispatch: AppDispatch) => {
      dispatch(markAllRead());
    },
  },
  {
    icon: <IconArrowsRotate />,
    name: msg`手动刷新`,
    handler: (dispatch: AppDispatch) => {
      dispatch(refresh());
    },
  },
  {
    icon: <IconShuffle />,
    name: msg`切换学期`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleChangeSemesterDialog(true));
    },
  },
  {
    icon: <IconTrash />,
    name: msg`清空缓存`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleClearDataDialog(true));
    },
  },
  {
    icon: <IconUser />,
    name: msg`退出登录`,
    handler: (dispatch: AppDispatch) => {
      dispatch(toggleLogoutDialog(true));
    },
  },
] as const;
