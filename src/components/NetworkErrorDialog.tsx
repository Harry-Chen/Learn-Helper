import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { INetworkErrorDialogProps } from '../types/Dialogs';

const initialState = {
  open: true,
};

export class NetworkErrorDialog extends React.Component<INetworkErrorDialogProps, typeof initialState> {
  public state = initialState;

  constructor(prop) {
    super(prop);
    this.state.open = prop.shouldOpen;
  }

  public render(): React.ReactNode {
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>刷新课程信息失败</DialogTitle>
        <DialogContent>
          <DialogContentText>哎呀！网络不怎么给力，或者服务器又去思考人生了。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onRetryClicked}>
            重试加载
          </Button>
          <Button color="primary" onClick={this.onCancelClicked}>
            离线查看
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private onCancelClicked = () => {
    this.setState({ open: false });
    this.props.offlineHandler();
  };

  private onRetryClicked = () => {
    this.setState({ open: false });
    this.props.refreshHandler();
  };
}
