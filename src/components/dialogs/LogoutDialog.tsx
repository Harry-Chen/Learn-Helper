import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLoginDialog, toggleLogoutDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { clearAllData } from '../../redux/actions/data';
import { loggedOut } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';
import { removeStoredCredential } from '../../utils/storage';

import CommonDialog from './CommonDialog';

class LogoutDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  return {
    open: (state[STATE_UI] as UiState).showLogoutDialog,
    title: '退出登录',
    content: '您确认要退出登录吗？如果只是更换登录密码，请不要选择清除数据。',
    firstButton: '退出',
    secondButton: '退出并清除数据',
    thirdButton: '取消',
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): Partial<ICommonDialogProps> => {
  return {
    firstButtonOnClick: () => {
      dispatch(async _dispatch => {
        await removeStoredCredential();
        _dispatch(toggleLogoutDialog(false));
        _dispatch(loggedOut());
        _dispatch(toggleLoginDialog(true));
      });
    },
    secondButtonOnClick: () => {
      dispatch(async _dispatch => {
        await removeStoredCredential();
        _dispatch(toggleLogoutDialog(false));
        _dispatch(loggedOut());
        _dispatch(clearAllData());
        _dispatch(toggleLoginDialog(true));
      });
    },
    thirdButtonOnClick: () => {
      dispatch(toggleLogoutDialog(false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogoutDialog);
