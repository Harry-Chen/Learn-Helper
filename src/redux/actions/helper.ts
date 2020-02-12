import { Learn2018Helper } from 'thu-learn-lib/lib';
import { ContentType, SemesterType } from 'thu-learn-lib/lib/types';

import {
  loginEnd,
  setProgressBar,
  showSnackbar,
  toggleLoginDialog,
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
} from './data';
import { HelperActionType } from './actionTypes';

import { STATE_DATA, STATE_HELPER, STATE_UI } from '../reducers';
import { HelperState } from '../reducers/helper';
import { DataState } from '../reducers/data';
import { UiState } from '../reducers/ui';

import { SnackbarType } from '../../types/dialogs';
import { getStoredCredential, storeCredential } from '../../utils/storage';

// here we don't catch errors in login(), for there are two cases:
// 1. silent login when starting, then NetworkErrorDialog should be shown
// 2. explicit login in LoginDialog, then login dialog should still be shown
export function login(username: string, password: string, save: boolean) {
  return async (dispatch, getState) => {
    dispatch(toggleLoginDialogProgress(true));
    const helperState = getState()[STATE_HELPER] as HelperState;
    const helper = helperState.helper as Learn2018Helper;

    let loginEnded = false;

    // wait at most 3 seconds for timeout
    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!getState()[STATE_HELPER].loggedIn) {
          if (!loginEnded) {
            dispatch(showSnackbar('登录超时', SnackbarType.ERROR));
            dispatch(loginEnd());
          }
          reject('login timeout');
        } else resolve(true);
      }, 3000);
    });

    const res = await Promise.race([helper.login(username, password), timeout]);
    // login failed
    if (res !== true) {
      loginEnded = true;
      dispatch(showSnackbar('登录失败', SnackbarType.ERROR));
      dispatch(loginEnd());
      return Promise.reject('login failed');
    }
    // login succeeded
    // hide login dialog (if shown), show success notice
    dispatch(showSnackbar('登录成功', SnackbarType.SUCCESS));
    // save salted user credential if asked
    if (save) {
      await storeCredential(username, password);
    }
    dispatch(loggedIn());
    dispatch(loginEnd());
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
      dispatch(
        showSnackbar('离上次成功刷新不足15分钟，若需要可手动刷新', SnackbarType.NOTIFICATION),
      );
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

    try {
      // refresh() might be dispatched before logged in
      // which can only occur when logging in with saved credentials but failed
      // and then user choose to try again
      // if (!helperState.loggedIn) {
      // however we choose to login every time
      // to avoid the confusion caused by session timeout
      // this is not expensive anyway
      const credential = await getStoredCredential();
      const loginResult = await helper.login(credential.username, credential.password);
      if (!loginResult) return Promise.reject(new Error('login failed again'));
      dispatch(loggedIn());
      // }
      const s = await helper.getCurrentSemester();

      // user required to ignore semester problem
      const data = getState()[STATE_DATA] as DataState;
      const ui = getState()[STATE_UI] as UiState;
      const ignoreSemester = data.insistSemester || ui.ignoreWrongSemester;

      if (data.semester.type === SemesterType.UNKNOWN) {
        // no semester info yet
        dispatch(updateSemester(s));
      } else if (s.id !== data.semester.id && !ignoreSemester) {
        // stored semester differ with fetched one
        dispatch(newSemester(s));
        dispatch(toggleNewSemesterDialog(true));
        return;
      }

      dispatch(setProgressBar(10));

      // get the latest semester id, since it can either be changed or not
      const currentSemesterId = (getState()[STATE_DATA] as DataState).semester.id;
      const courses = await helper.getCourseList(currentSemesterId);
      dispatch(updateCourses(courses));
      dispatch(setProgressBar(20));

      const allCourseIds = courses.map(c => c.id);

      let res = await helper.getAllContents(allCourseIds, ContentType.NOTIFICATION);
      dispatch(updateNotification(res));
      dispatch(setProgressBar(36));

      res = await helper.getAllContents(allCourseIds, ContentType.FILE);
      dispatch(updateFile(res));
      dispatch(setProgressBar(52));

      res = await helper.getAllContents(allCourseIds, ContentType.HOMEWORK);
      dispatch(updateHomework(res));
      dispatch(setProgressBar(68));

      res = await helper.getAllContents(allCourseIds, ContentType.DISCUSSION);
      dispatch(updateDiscussion(res));
      dispatch(setProgressBar(84));

      res = await helper.getAllContents(allCourseIds, ContentType.QUESTION);
      dispatch(updateQuestion(res));
      dispatch(updateFinished());
      dispatch(setProgressBar(100));
      dispatch(showSnackbar('更新成功！', SnackbarType.SUCCESS));

      // wait some time before hiding progressbar
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    } catch (e) {
      console.error(e);
      dispatch(toggleNetworkErrorDialog(true));
    } finally {
      dispatch(toggleProgressBar(false));
    }
  };
}
