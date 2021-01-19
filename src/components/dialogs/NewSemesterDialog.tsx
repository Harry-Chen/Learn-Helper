import React from 'react';
import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleIgnoreWrongSemester, toggleNewSemesterDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_DATA, STATE_UI } from '../../redux/reducers';
import { formatSemester } from '../../utils/format';
import { insistSemester, updateSemester } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { DataState } from '../../redux/reducers/data';
import { UiState } from '../../redux/reducers/ui';

import CommonDialog from './CommonDialog';

class NewSemesterDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  const data = state[STATE_DATA] as DataState;
  return {
    open: (state[STATE_UI] as UiState).showNewSemesterDialog,
    title: '检测到新学期',
    content: (
      <span>
        当前 Learn Helper 学期：
        {formatSemester(data.semester)}
        <br />
        当前网络学堂学期：
        {formatSemester(data.fetchedSemester)}
        <br />
        是否要进行学期切换（本学期已读、星标等状态将会被清空）？
        <br />
        如果选择“否”，则在下一次打开 Learn Helper 前都将保持当前学期。
        <br />
        如果选择“不再询问”，则需要手动进行学期切换。
      </span>
    ),
    firstButton: '是',
    secondButton: '否',
    thirdButton: '不再询问',
  };
};

const mapDispatchToProps = (dispatch): Partial<ICommonDialogProps> => ({
  firstButtonOnClick: () => {
    dispatch(toggleNewSemesterDialog(false));
    dispatch((_dispatch, getState) => {
      _dispatch(updateSemester((getState()[STATE_DATA] as DataState).fetchedSemester));
    });
    dispatch(refresh());
  },
  secondButtonOnClick: () => {
    dispatch(toggleNewSemesterDialog(false));
    dispatch(toggleIgnoreWrongSemester(true));
    dispatch(refresh());
  },
  thirdButtonOnClick: () => {
    dispatch(toggleNewSemesterDialog(false));
    dispatch(insistSemester(true));
    dispatch(refresh());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewSemesterDialog);
