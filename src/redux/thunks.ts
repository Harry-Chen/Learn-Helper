import {
  ContentType,
  Language,
  type ApiError,
  CourseType,
  SemesterType,
} from 'thu-learn-lib/lib/types';
import type { ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { i18n } from 'webextension-polyfill';

import type { ContentInfo, FileInfo } from '../types/data';
import { SnackbarType } from '../types/dialogs';
import { initiateFileDownload } from '../utils/download';
import { failReasonToString } from '../utils/format';
import { t } from '../utils/i18n';
import { getStoredCredential, storeCredential } from '../utils/storage';

import type { RootState } from './store';
import {
  loginEnd,
  setLoadingProgress,
  showSnackbar,
  toggleLoadingProgressBar,
  toggleLoginDialogProgress,
  toggleNetworkErrorDialog,
  toggleNewSemesterDialog,
} from './reducers/ui';
import { loggedIn } from './reducers/helper';
import {
  updateSemesterList,
  newSemester,
  updateSemester,
  updateCourses,
  updateNotification,
  updateHomework,
  updateFile,
  updateDiscussion,
  updateQuestion,
  updateFinished,
  toggleReadState,
} from './reducers/data';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

// here we don't catch errors in login(), for there are two cases:
// 1. silent login when starting, then NetworkErrorDialog should be shown
// 2. explicit login in LoginDialog, then login dialog should still be shown
export const login =
  (username: string, password: string, save: boolean): AppThunk =>
  async (dispatch, getState) => {
    dispatch(toggleLoginDialogProgress(true));
    const helperState = getState().helper;
    const helper = helperState.helper;

    // wait at most 5 seconds for timeout
    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject({ reason: 'TIMEOUT' });
      }, 5000);
    });

    try {
      await Promise.race([helper.login(username, password), timeout]);
    } catch (e) {
      const error = e as ApiError;
      dispatch(
        showSnackbar({
          content: t('Snackbar_LoginFailed', [
            (failReasonToString(error?.reason) ?? error).toString() ?? t('Snackbar_UnknownError'),
          ]),
          type: SnackbarType.ERROR,
        }),
      );
      dispatch(loginEnd());
      return Promise.reject(`login failed: ${error}`);
    }

    // login succeeded
    // hide login dialog (if shown), show success notice
    dispatch(showSnackbar({ content: t('Snackbar_LoginSuccess'), type: SnackbarType.SUCCESS }));
    // save salted user credential if asked
    if (save) {
      await storeCredential(username, password);
    }
    dispatch(loggedIn());
    dispatch(loginEnd());
    // try to sync language with Web Learning
    try {
      const langMap = {
        'zh-CN': Language.ZH_CN,
        'en-US': Language.EN_US,
      };
      const lang = langMap[i18n.getUILanguage()];
      if (lang) {
        await helper.setLanguage(lang);
      }
    } catch (e) {
      const error = e as ApiError;
      dispatch(
        showSnackbar({
          content: t('Snackbar_SetLangFailed', [
            (failReasonToString(error?.reason) ?? error).toString() ?? t('Snackbar_UnknownError'),
          ]),
          type: SnackbarType.WARNING,
        }),
      );
    }
    return Promise.resolve();
  };

export const refreshIfNeeded = (): AppThunk => (dispatch, getState) => {
  const data = getState().data;
  const justUpdated = new Date().getTime() - data.lastUpdateTime.getTime() <= 15 * 60 * 1000;
  if (data.updateFinished && justUpdated) {
    dispatch(
      showSnackbar({ content: t('Snackbar_NotRefreshed'), type: SnackbarType.NOTIFICATION }),
    );
  } else {
    dispatch(refresh());
  }
};

export const refresh = (): AppThunk => async (dispatch, getState) => {
  dispatch(toggleLoadingProgressBar(true));
  dispatch(setLoadingProgress(0));
  const helperState = getState().helper;
  const helper = helperState.helper;

  let allCourseIds: string[] = [];

  const progresses = [0, 10, 20, 38, 52, 68, 84, 100];
  const nextProgress = () => {
    const uiState = getState().ui;
    const currentProgress = uiState.loadingProgress;
    const index = progresses.indexOf(currentProgress);
    let nextProgress = 100;
    if (index >= 0 && index < progresses.length) {
      nextProgress = progresses[index + 1];
    } else {
      console.warn(`Next progress not found, current ${currentProgress}`, progresses);
    }
    dispatch(setLoadingProgress(nextProgress));
  };

  try {
    // login on every refresh (if stored)
    const credential = await getStoredCredential();
    credential && (await helper.login(credential.username, credential.password));
    dispatch(loggedIn());

    const semesters = await helper.getSemesterIdList();
    dispatch(updateSemesterList(semesters));

    const s = await helper.getCurrentSemester();
    dispatch(newSemester(s));

    // user required to ignore semester problem
    const data = getState().data;
    const ui = getState().ui;
    const ignoreSemester = data.insistSemester || ui.ignoreWrongSemester;

    if (data.semester.type === SemesterType.UNKNOWN) {
      // no semester info yet
      dispatch(updateSemester(s));
    } else if (s.id !== data.semester.id && !ignoreSemester) {
      // stored semester differ with fetched one
      dispatch(toggleNewSemesterDialog(true));
      return;
    }

    nextProgress();

    // get the latest semester id, since it can either be changed or not
    const currentSemesterId = getState().data.semester.id;
    // get all courses
    const courses = await helper.getCourseList(currentSemesterId);
    allCourseIds = courses.map((c) => c.id);
    dispatch(updateCourses(courses));
    nextProgress();
  } catch (e) {
    console.error(e);
    dispatch(toggleLoadingProgressBar(false));
    dispatch(toggleNetworkErrorDialog(true));
    return;
  }

  // send all requests in parallel
  const fetchAll = [
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.NOTIFICATION,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateNotification(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.HOMEWORK,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateHomework(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.FILE,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateFile(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.DISCUSSION,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateDiscussion(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.QUESTION,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateQuestion(res));
      nextProgress();
    },
  ];

  // check results
  const failures = (await Promise.allSettled(fetchAll.map((f) => f()))).filter(
    (p) => p.status == 'rejected',
  );
  const allSuccess = failures.length == 0;
  if (allSuccess) {
    dispatch(showSnackbar({ content: t('Snackbar_UpdateSuccess'), type: SnackbarType.SUCCESS }));
  } else {
    dispatch(
      showSnackbar({ content: t('Snackbar_UpdatePartialSuccess'), type: SnackbarType.WARNING }),
    );
    console.warn('Failures occurred in fetching data', failures);
  }

  // finish refreshing
  dispatch(updateFinished());

  // wait some time before hiding progress bar
  new Promise((resolve) => {
    setTimeout(() => {
      dispatch(toggleLoadingProgressBar(false));
      resolve(null); // to make tsc happy
    }, 1000);
  });
};

export const downloadAllUnreadFiles =
  (contents: ContentInfo[]): AppThunk =>
  async (dispatch, getState) => {
    const helper = getState().helper.helper;
    try {
      await helper.getSemesterIdList();
    } catch (e) {
      dispatch(showSnackbar({ content: '登录已过期，请刷新后重试', type: SnackbarType.ERROR }));
      return;
    }
    for (const c of contents) {
      if (c.type === ContentType.FILE && !c.hasRead) {
        const file = c as FileInfo;
        initiateFileDownload(file.downloadUrl);
        dispatch(toggleReadState({ id: file.id, type: ContentType.FILE, state: true }));
      }
    }
  };
