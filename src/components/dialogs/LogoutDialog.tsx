import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLogoutDialog } from '../../redux/actions/ui';
import { connect } from 'react-redux';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { clearAllData } from '../../redux/actions/data';
import { loggedOut } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';

class LogoutDialog extends React.Component<ICommonDialogProps> {
  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>退出登录</DialogTitle>
        <DialogContent>
          <DialogContentText>
            退出登录时，是否同时清空所有数据？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleLogoutDialog(false));
              this.props.dispatch(loggedOut());
              this.props.dispatch(clearAllData());
            }}
          >
            是
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleLogoutDialog(false));
              this.props.dispatch(loggedOut());
            }}
          >
            否
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
