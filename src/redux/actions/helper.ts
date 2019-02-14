import {
  setProgressBar,
  setSnackbar,
  toggleLoginDialog,
  toggleLoginDialogProgress,
  toggleNetworkErrorDialog,
  toggleNewSemesterDialog,
  toggleProgressBar,
  toggleSnackbar,
} from './ui';
import { Learn2018Helper } from 'thu-learn-lib/lib';
import { SnackbarType } from '../../types/dialogs';
import { STORAGE_KEY_PASSWORD, STORAGE_KEY_USERNAME, STORAGE_SALT } from '../../constants';
import { cipher } from '../../utils/crypto';
import { STATE_DATA, STATE_HELPER, STATE_UI } from '../reducers';
import { HelperState } from '../reducers/helper';
import { DataState } from '../reducers/data';
import {
  newSemester,
  updateCourses,
  updateDiscussion,
  updateFile,
  updateHomework,
  updateNotification,
  updateQuestion, updateSemester,
} from './data';
import { getCourseIdListForContent } from '../selectors';
import { ContentType, SemesterType } from 'thu-learn-lib/lib/types';
import { UiState } from '../reducers/ui';
import { HelperActionType } from './actionTypes';
import { getStoredCredential, setChromeStorageAsync } from '../../utils/storage';

export function login(username: string, password: string, save: boolean) {

  return async (dispatch, getState) => {
    dispatch(toggleLoginDialogProgress(true));
    const helper = getState().helper.helper as Learn2018Helper;
    const res = await helper.login(username, password);
    // login failed
    if (!res) return Promise.reject();
    // login succeeded
    // hide login dialog (if shown), show success notice
    dispatch(toggleSnackbar(true));
    dispatch(setSnackbar('登录成功', SnackbarType.SUCCESS));
    dispatch(toggleLoginDialog(false));
    // save salted user credential if asked
    if (save) {
      const cipherImpl = cipher(STORAGE_SALT);
      await setChromeStorageAsync('local', {
        [STORAGE_KEY_USERNAME]: cipherImpl(username),
        [STORAGE_KEY_PASSWORD]: cipherImpl(password),
      });
    }
    dispatch(loggedIn());
    return Promise.resolve();
  };
}

export function loginFail() {
  return (dispatch) => {
    dispatch(toggleLoginDialog(true));
    dispatch(toggleLoginDialogProgress(false));
    dispatch(toggleSnackbar(true));
    dispatch(setSnackbar('登录失败', SnackbarType.ERROR));
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

export function refresh() {
  return async (dispatch, getState) => {
    dispatch(toggleProgressBar(true));
    dispatch(setProgressBar(0));
    const helperState = (getState()[STATE_HELPER] as HelperState);
    const helper = helperState.helper as Learn2018Helper;

    try {
      // refresh() dispatched before logged in
      // which can only occur when logging in with saved credentials but failed
      // mainly due to network disconnection, or that the user has changed his password
      // so we can try login again
      if (!helperState.loggedIn) {
        const credential = await getStoredCredential();
        const loginResult = await helper.login(credential.username, credential.password);
        if (loginResult) return Promise.reject();
        dispatch(loggedIn());
      }
      const s = await helper.getCurrentSemester();

      // user required to ignore semester problem
      const data = (getState()[STATE_DATA] as DataState);
      const ui = (getState()[STATE_UI] as UiState);
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

      const courses = await helper.getCourseList(s.id);
      dispatch(updateCourses(courses));
      dispatch(setProgressBar(20));

      let res = await helper.getAllContents(
        getCourseIdListForContent(getState, ContentType.NOTIFICATION),
        ContentType.NOTIFICATION,
      );
      dispatch(updateNotification(res));
      dispatch(setProgressBar(36));

      res = await helper.getAllContents(
        getCourseIdListForContent(getState, ContentType.FILE),
        ContentType.FILE,
      );
      dispatch(updateFile(res));
      dispatch(setProgressBar(52));

      res = await helper.getAllContents(
        getCourseIdListForContent(getState, ContentType.HOMEWORK),
        ContentType.HOMEWORK,
      );
      dispatch(updateHomework(res));
      dispatch(setProgressBar(68));

      res = await helper.getAllContents(
        getCourseIdListForContent(getState, ContentType.DISCUSSION),
        ContentType.DISCUSSION,
      );
      dispatch(updateDiscussion(res));
      dispatch(setProgressBar(84));

      res = await helper.getAllContents(
        getCourseIdListForContent(getState, ContentType.QUESTION),
        ContentType.QUESTION,
      );
      dispatch(updateQuestion(res));
      dispatch(setProgressBar(100));
      dispatch(toggleSnackbar(true));
      dispatch(setSnackbar('更新成功！', SnackbarType.SUCCESS));

      // wait 300ms before hiding progressbar
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    } catch (e) {
      dispatch(toggleNetworkErrorDialog(true));
    } finally {
      dispatch(toggleProgressBar(false));
    }
  };
}
