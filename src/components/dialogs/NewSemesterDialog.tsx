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
      <section>
        当前学期为：{formatSemester(data.semester)}
        <br />
        当前网络学堂学期为：{formatSemester(data.fetchedSemester)}
        <br />
        是否要进行学期切换（本学期数据将会被清空，操作不可逆）？
        <br />
        如果您选择“不再询问”，则需要手动进行缓存清理。
      </section>
    ),
    firstButton: '是',
    secondButton: '否',
    thirdButton: '不再询问',
  };
};

const mapDispatchToProps = (dispatch): Partial<ICommonDialogProps> => {
  return {
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSemesterDialog);
