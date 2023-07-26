import React from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  TextField,
} from '@mui/material';

import { ILoginDialogProps } from '../../types/dialogs';

import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { toggleLoginDialog } from '../../redux/actions/ui';
import { login, refresh } from '../../redux/actions/helper';
import { requestPermission } from '../../utils/permission';

class LoginDialog extends React.PureComponent<ILoginDialogProps, never> {
  private username = '';

  private password = '';

  private save = false;

  constructor(prop: ILoginDialogProps) {
    super(prop);
  }

  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open} keepMounted>
        <DialogTitle>登录网络学堂</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请输入您的学号/用户名和密码以登录到网络学堂。
            <br />
            请注意，本插件默认不会保存您的凭据；每次打开新的学堂助手页面时，您都需要重新输入。
            如果您选择保存凭据，则本插件会将其
            <b>保存在本地</b>
            ，并启用自动登录功能。
            <br />
            我们对凭据进行了简单的加密，但并不能完全防止其被第三方读取。
            在长时间不使用或者出借计算机时，请务必退出登录，以免您的凭据被泄露。
            <br />
            如果您选择登录，则视为您已经阅读并同意
            <a href="about.html" target="_blank">
              此页面
            </a>
            中的所有内容。 否则，请立刻停止使用并从浏览器中卸载本插件。
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            id="username"
            label="用户名/学号"
            type="text"
            required
            multiline={false}
            onChange={(e) => {
              this.username = e.target.value;
            }}
          />
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            id="password"
            label="密码"
            type="password"
            required
            multiline={false}
            onChange={(e) => {
              this.password = e.target.value;
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="saveCredential"
                onChange={(e) => {
                  this.save = e.target.checked;
                }}
              />
            }
            label="保存凭据以自动登录"
          />
        </DialogContent>
        <DialogActions>
          {this.props.inLoginProgress ? (
            <CircularProgress size={30} variant="indeterminate" />
          ) : null}
          <Button
            color="primary"
            disabled={this.props.inLoginProgress}
            onClick={async () => {
              try {
                await requestPermission();
                await this.props.dispatch<any>(login(this.username, this.password, this.save));
                await this.props.dispatch<any>(refresh());
              } catch (e) {
                // here we catch only login problems
                // for refresh() has a try-catch block in itself
                console.log(e);
                this.props.dispatch<any>(toggleLoginDialog(true));
              }
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
