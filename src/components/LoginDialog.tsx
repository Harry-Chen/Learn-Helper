import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { ILoginDialogProps, SnackbarType } from '../types/Dialogs';

const initialState = {
  open: true,
  submitEnabled: true,
};

export class LoginDialog extends React.Component<ILoginDialogProps, typeof initialState> {
  public state = initialState;

  private username: string = '';
  private password: string = '';
  private save: boolean = false;

  constructor(prop) {
    super(prop);
    this.state.open = prop.shouldOpen;
  }

  public render(): React.ReactNode {
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>登录网络学堂</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请输入您的学号/用户名和密码以登录到网络学堂。
            <br />
            请注意，本插件默认不会保存您的凭据；每次打开新的学堂助手时，您都需要重新输入。 如果您打开保存功能，则凭据
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
          <Button color="primary" disabled={!this.state.submitEnabled} onClick={this.onLoginClicked} type="submit">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private setOpen(opened: boolean) {
    this.setState({ open: opened });
  }

  private onLoginClicked = () => {
    this.setState({ submitEnabled: false });
    this.props.loginHandler(this.username, this.password, this.save).then(res => {
      this.setState({ submitEnabled: true });
      if (res) {
        this.setOpen(false);
        this.props.snackbarHandler('登录成功', SnackbarType.SUCCESS);
      } else {
        this.props.snackbarHandler('登录失败', SnackbarType.ERROR);
      }
    });
  };
}
