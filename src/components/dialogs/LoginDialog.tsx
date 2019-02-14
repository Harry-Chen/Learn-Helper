import React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';


import { ILoginDialogProps } from '../../types/dialogs';

import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { login, loginFail, refresh } from '../../redux/actions/helper';

class LoginDialog extends React.Component<ILoginDialogProps, never> {
  private username: string = '';
  private password: string = '';
  private save: boolean = false;

  constructor(prop: ILoginDialogProps) {
    super(prop);
  }

  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>登录网络学堂</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请输入您的学号/用户名和密码以登录到网络学堂。
            <br />
            请注意，本插件默认不会保存您的凭据；每次打开新的学堂助手时，您都需要重新输入。
            如果您打开保存功能，则凭据
            <b>会被保存在本地</b>。
          </DialogContentText>
          <TextField
            autoFocus={true}
            margin="dense"
            id="username"
            label="用户名/学号"
            type="text"
            required={true}
            multiline={false}
            onChange={e => {
              this.username = e.target.value;
            }}
          />
          <br />
          <TextField
            autoFocus={true}
            margin="dense"
            id="password"
            label="密码"
            type="password"
            required={true}
            multiline={false}
            onChange={e => {
              this.password = e.target.value;
            }}
          />
          <br />
          <Checkbox
            id="saveCredential"
            onChange={e => {
              this.save = e.target.checked;
            }}
          />
          保存凭据以自动登录
        </DialogContent>
        <DialogActions>
          {
            this.props.inLoginProgress ?
            <CircularProgress
              size={30}
              variant={'indeterminate'}
            /> : null
          }
          <Button
            color="primary"
            disabled={this.props.inLoginProgress}
            onClick={() => {
              this.props.dispatch<any>(login(this.username, this.password, this.save))
                .then(() => { this.props.dispatch<any>(refresh()); })
                .catch(() => { this.props.dispatch<any>(loginFail()); });
            }}
            type="submit"
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<ILoginDialogProps> => {
  const uiState = state[STATE_UI];
  return {
    open: uiState.showLoginDialog,
    inLoginProgress: uiState.inLoginProgress,
  };
};

export default connect(mapStateToProps)(LoginDialog);
