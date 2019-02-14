import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { INewSemesterDialogProps } from '../../types/dialogs';
import { toggleIgnoreWrongSemester, toggleNewSemesterDialog } from '../../redux/actions/ui';
import { connect } from 'react-redux';
import { IUiStateSlice, STATE_DATA, STATE_UI } from '../../redux/reducers';
import { formatSemester } from '../../utils/format';
import { insistSemester, updateSemester } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { DataState } from '../../redux/reducers/data';
import { UiState } from '../../redux/reducers/ui';

class NewSemesterDialog extends React.Component<INewSemesterDialogProps> {
  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>检测到新学期</DialogTitle>
        <DialogContent>
          <DialogContentText>
            当前学期为：{formatSemester(this.props.currentSemester)}<br />
            当前网络学堂学期为：{formatSemester(this.props.newSemester)}<br />
            是否要进行学期切换（本学期数据将会被清空，操作不可逆）？<br />
            如果您选择“不再询问”，则需要手动进行缓存清理。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleNewSemesterDialog(false));
              this.props.dispatch(updateSemester(this.props.newSemester));
              this.props.dispatch(refresh());
            }}
          >
            是
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleNewSemesterDialog(false));
              this.props.dispatch(toggleIgnoreWrongSemester(true));
              this.props.dispatch(refresh());
            }}
          >
            否
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.props.dispatch(toggleNewSemesterDialog(false));
              this.props.dispatch(insistSemester(true));
              this.props.dispatch(refresh());
            }}
          >
            不再询问
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<INewSemesterDialogProps> => {
  return {
    open: (state[STATE_UI] as UiState).showNewSemesterDialog,
    currentSemester: (state[STATE_DATA] as DataState).semester,
    newSemester: (state[STATE_DATA] as DataState).fetchedSemester,
  };
};

export default connect(mapStateToProps)(NewSemesterDialog);
