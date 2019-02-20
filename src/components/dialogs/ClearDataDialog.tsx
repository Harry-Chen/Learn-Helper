import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleClearDataDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { clearAllData } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';

import CommonDialog from './CommonDialog';

class ClearDataDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  return {
    open: (state[STATE_UI] as UiState).showClearDataDialog,
    title: '清除所有缓存',
    content: '确认要清除吗？所有缓存的数据和已读状态将会被清除。',
    firstButton: '是',
    secondButton: '否',
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): Partial<ICommonDialogProps> => {
  return {
    firstButtonOnClick: () => {
      dispatch(toggleClearDataDialog(false));
      dispatch(clearAllData());
      dispatch(refresh());
    },
    secondButtonOnClick: () => {
      dispatch(toggleClearDataDialog(false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClearDataDialog);
