import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLoginDialog, toggleLogoutDialog } from '../../redux/actions/ui';
import { connect } from 'react-redux';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { clearAllData } from '../../redux/actions/data';
import { loggedOut } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';
import { removeStoredCredential } from '../../utils/storage';

class LogoutDialog extends React.Component<ICommonDialogProps> {
  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>退出登录</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确认要退出登录吗？如果只是更换登录密码，请不要选择清除数据。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(async _dispatch => {
                await removeStoredCredential();
                _dispatch(toggleLogoutDialog(false));
                _dispatch(loggedOut());
                _dispatch(toggleLoginDialog(true));
              });
            }}
          >
            退出
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(async _dispatch => {
                await removeStoredCredential();
                _dispatch(toggleLogoutDialog(false));
                _dispatch(loggedOut());
                _dispatch(clearAllData());
                _dispatch(toggleLoginDialog(true));
              });
            }}
          >
            退出并清除数据
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleLogoutDialog(false));
            }}
          >
            取消
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  return {
    open: (state[STATE_UI] as UiState).showLogoutDialog,
  };
};

export default connect(mapStateToProps)(LogoutDialog);
