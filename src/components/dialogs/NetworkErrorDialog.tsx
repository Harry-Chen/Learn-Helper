import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLoginDialog, toggleNetworkErrorDialog } from '../../redux/actions/ui';
import { connect } from 'react-redux';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { loggedIn, refresh } from '../../redux/actions/helper';

class NetworkErrorDialog extends React.Component<ICommonDialogProps> {
  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>刷新课程信息失败</DialogTitle>
        <DialogContent>
          <DialogContentText>
            可能原因有：
            <br />
            · 网络不太给力
            <br />
            · 服务器去思考人生了
            <br />
            · 保存的用户凭据不正确（修改过密码）
            <br />
            您可以选择重试或者放弃加载，或者更换新的凭据。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleNetworkErrorDialog(false));
              this.props.dispatch(refresh());
            }}
          >
            重试加载
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleNetworkErrorDialog(false));
              this.props.dispatch(loggedIn());
            }}
          >
            离线查看
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleNetworkErrorDialog(false));
              this.props.dispatch(toggleLoginDialog(true));
            }}
          >
            更新凭据
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  return {
    open: state[STATE_UI].showNetworkErrorDialog,
  };
};

export default connect(mapStateToProps)(NetworkErrorDialog);
