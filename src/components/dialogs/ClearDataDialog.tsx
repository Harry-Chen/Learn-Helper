import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleClearDataDialog } from '../../redux/actions/ui';
import { connect } from 'react-redux';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { clearAllData } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';

class ClearDataDialog extends React.Component<ICommonDialogProps> {
  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>清除所有缓存</DialogTitle>
        <DialogContent>
          <DialogContentText>确认要清除吗？所有缓存的数据和已读状态将会被清除。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleClearDataDialog(false));
              this.props.dispatch(clearAllData());
              this.props.dispatch(refresh());
            }}
          >
            是
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleClearDataDialog(false));
            }}
          >
            否
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  return {
    open: (state[STATE_UI] as UiState).showClearDataDialog,
  };
};

export default connect(mapStateToProps)(ClearDataDialog);
