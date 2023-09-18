import React from 'react';
import type { ReactElement } from 'react';
import { ContentType } from 'thu-learn-lib';
import { msg } from '@lingui/macro';
import type { MessageDescriptor } from '@lingui/core';

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

type Icon = ReactElement;

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

export interface IMenuItem {
  name: MessageDescriptor;
  icon: Icon;
  type?: ContentType | null;
}

export const COURSE_FUNC_LIST: IMenuItem[] = [
  {
    icon: <IconCircleInfo />,
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
    icon: <IconUpRightFromSquare />,
    name: msg`课程主页`,
  },
];

export const SUMMARY_FUNC_LIST: IMenuItem[] = [
  {
    icon: <IconHouse />,
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
    icon: <IconTrash />,
    name: msg`所有忽略`,
  },
];

export interface ISettingItem {
  name: MessageDescriptor;
  icon: Icon;
  handler?: (dispatch: AppDispatch) => void;
}

export const SETTINGS_FUNC_LIST: ISettingItem[] = [
  {
    icon: <IconBan />,
    name: msg`管理隐藏项`,
    handler: (dispatch: AppDispatch) => {
      dispatch(setDetailPage('content-ignore-setting'));
    },
  },
  {
    icon: <IconEnvelopeOpen />,
    name: msg`标记为已读`,
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
];
