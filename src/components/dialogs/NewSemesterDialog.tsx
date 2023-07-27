import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleIgnoreWrongSemester, toggleNewSemesterDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_DATA, STATE_UI } from '../../redux/reducers';
import { formatSemester } from '../../utils/format';
import { insistSemester, updateSemester } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { DataState } from '../../redux/reducers/data';
import { UiState } from '../../redux/reducers/ui';
import { t, tr } from '../../utils/i18n';

import CommonDialog from './CommonDialog';

class NewSemesterDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  const data = state[STATE_DATA] as DataState;
  return {
    open: (state[STATE_UI] as UiState).showNewSemesterDialog,
    title: t('NewSemesterDialog_Title'),
    content: tr('NewSemesterDialog_Content', [
      formatSemester(data.semester),
      formatSemester(data.fetchedSemester),
    ]),
    firstButton: t('Common_Yes'),
    secondButton: t('Common_No'),
    thirdButton: t('Common_NoAskAgain'),
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
