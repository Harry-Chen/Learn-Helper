import { setSnackbar, toggleLoginDialog, toggleLoginSubmit, toggleSnackbar } from './ui';
import { Learn2018Helper } from 'thu-learn-lib/lib';
import { SnackbarType } from '../../types/Dialogs';
import { STORAGE_KEY_PASSWORD, STORAGE_KEY_USERNAME, STORAGE_SALT } from '../../constants';
import { cipher } from '../../utils/crypto';

export function login(username: string, password: string, save: boolean) {

  const loginFail = (dispatch) => {
    // show login dialog (if not shown) and failure notice
    dispatch(toggleLoginDialog(true));
    dispatch(toggleLoginSubmit(true));
    dispatch(toggleSnackbar(true));
    dispatch(setSnackbar('登录失败', SnackbarType.ERROR));
  };

  return (dispatch, getState) => {
    dispatch(toggleLoginSubmit(false));
    const helper = getState().helper.helper as Learn2018Helper;
    return helper.login(username, password)
      .then(res => {
        if (res) {
          // hide login dialog (if shown), show success notice
          dispatch(toggleSnackbar(true));
          dispatch(setSnackbar('登录成功', SnackbarType.SUCCESS));
          dispatch(toggleLoginDialog(false));
          if (save) {
            const cipherImpl = cipher(STORAGE_SALT);
            chrome.storage.local.set({
              [STORAGE_KEY_USERNAME]: cipherImpl(username),
              [STORAGE_KEY_PASSWORD]: cipherImpl(password),
            });
          }
          // invoke refresh
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      })
      .catch(_ => {
        loginFail(dispatch);
        return Promise.reject();
      });

  };
}

export function refresh() {
  console.log('Refreshing');
  return (dispatch, getState) => {

  };
}
