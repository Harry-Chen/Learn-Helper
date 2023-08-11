import { Learn2018Helper } from 'thu-learn-lib/lib';
import { ContentType, SemesterType, ApiError, CourseType, Language } from 'thu-learn-lib/lib/types';
import { i18n } from 'webextension-polyfill';

import {
  loginEnd,
  setProgressBar,
  showSnackbar,
  toggleLoginDialogProgress,
  toggleNetworkErrorDialog,
  toggleNewSemesterDialog,
  toggleProgressBar,
} from './ui';
import {
  newSemester,
  updateCourses,
  updateDiscussion,
  updateFile,
  updateFinished,
  updateHomework,
  updateNotification,
  updateQuestion,
  updateSemester,
  updateSemesterList,
} from './data';
import { HelperActionType } from './actionTypes';

import { STATE_DATA, STATE_HELPER, STATE_UI } from '../reducers';
import { HelperState } from '../reducers/helper';
import { DataState } from '../reducers/data';
import { UiState } from '../reducers/ui';

import { SnackbarType } from '../../types/dialogs';
import { failReasonToString } from '../../utils/format';
import { getStoredCredential, storeCredential } from '../../utils/storage';
import { t } from '../../utils/i18n';

// here we don't catch errors in login(), for there are two cases:
// 1. silent login when starting, then NetworkErrorDialog should be shown
// 2. explicit login in LoginDialog, then login dialog should still be shown
export function login(username: string, password: string, save: boolean) {
  return async (dispatch, getState) => {
    dispatch(toggleLoginDialogProgress(true));
    const helperState = getState()[STATE_HELPER] as HelperState;
    const helper = helperState.helper as Learn2018Helper;

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
        showSnackbar(
          t('Snackbar_LoginFailed', [
            (failReasonToString(error?.reason) ?? error).toString() ?? t('Snackbar_UnknownError'),
          ]),
          SnackbarType.ERROR,
        ),
      );
      dispatch(loginEnd());
      return Promise.reject(`login failed: ${error}`);
    }

    // login succeeded
    // hide login dialog (if shown), show success notice
    dispatch(showSnackbar(t('Snackbar_LoginSuccess'), SnackbarType.SUCCESS));
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
        showSnackbar(
          t('Snackbar_SetLangFailed', [
            (failReasonToString(error?.reason) ?? error).toString() ?? t('Snackbar_UnknownError'),
          ]),
          SnackbarType.WARNING,
        ),
      );
    }
    return Promise.resolve();
  };
}

export function loggedIn() {
  return {
    type: HelperActionType.LOGIN,
  };
}

export function loggedOut() {
  return {
    type: HelperActionType.LOGOUT,
  };
}

// avoid too frequent refresh (15 min)
export function refreshIfNeeded() {
  return (dispatch, getState) => {
    const data = getState()[STATE_DATA] as DataState;
    const justUpdated = new Date().getTime() - data.lastUpdateTime.getTime() <= 15 * 60 * 1000;
    if (data.updateFinished && justUpdated) {
      dispatch(showSnackbar(t('Snackbar_NotRefreshed'), SnackbarType.NOTIFICATION));
    } else {
      dispatch(refresh());
    }
  };
}

export function refresh() {
  return async (dispatch, getState) => {
    dispatch(toggleProgressBar(true));
    dispatch(setProgressBar(0));
    const helperState = getState()[STATE_HELPER] as HelperState;
    const helper = helperState.helper as Learn2018Helper;

    let allCourseIds: string[] = [];

    const progresses = [0, 10, 20, 38, 52, 68, 84, 100];
    const nextProgress = () => {
      const uiState = getState()[STATE_UI] as UiState;
      const currentProgress = uiState.loadingProgress;
      const index = progresses.indexOf(currentProgress);
      let nextProgress = 100;
      if (index >= 0 && index < progresses.length) {
        nextProgress = progresses[index + 1];
      } else {
        console.warn(`Next progress not found, current ${currentProgress}`, progresses);
      }
      dispatch(setProgressBar(nextProgress));
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
      const data = getState()[STATE_DATA] as DataState;
      const ui = getState()[STATE_UI] as UiState;
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
      const currentSemesterId = (getState()[STATE_DATA] as DataState).semester.id;
      // get all courses
      const courses = await helper.getCourseList(currentSemesterId);
      allCourseIds = courses.map((c) => c.id);
      dispatch(updateCourses(courses));
      nextProgress();
    } catch (e) {
      console.error(e);
      dispatch(toggleProgressBar(false));
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
      dispatch(showSnackbar(t('Snackbar_UpdateSuccess'), SnackbarType.SUCCESS));
    } else {
      dispatch(showSnackbar(t('Snackbar_UpdatePartialSuccess'), SnackbarType.WARNING));
      console.warn('Failures occurred in fetching data', failures);
    }

    // finish refreshing
    dispatch(updateFinished());

    // wait some time before hiding progress bar
    new Promise((resolve) => {
      setTimeout(() => {
        dispatch(toggleProgressBar(false));
        resolve(null); // to make tsc happy
      }, 1000);
    });
  };
}
