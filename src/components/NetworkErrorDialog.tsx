import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { ICommonDialogProps } from '../types/dialogs';
import { toggleNetworkErrorDialog } from '../redux/actions/ui';
import { connect } from 'react-redux';
import { IUiStateSlice, STATE_UI } from '../redux/reducers';
import { refresh } from '../redux/actions/helper';

class NetworkErrorDialog extends React.Component<ICommonDialogProps> {
  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>刷新课程信息失败</DialogTitle>
        <DialogContent>
          <DialogContentText>哎呀！网络不怎么给力，或者服务器又去思考人生了。</DialogContentText>
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
            }}
          >
            离线查看
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
