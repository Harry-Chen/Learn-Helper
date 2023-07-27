import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleClearDataDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { clearAllData } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';
import { t } from '../../utils/i18n';

import CommonDialog from './CommonDialog';

class ClearDataDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => ({
  open: (state[STATE_UI] as UiState).showClearDataDialog,
  title: t('ClearDataDialog_Title'),
  content: t('ClearDataDialog_Content'),
  firstButton: t('Common_Yes'),
  secondButton: t('Common_No'),
});

const mapDispatchToProps = (dispatch): Partial<ICommonDialogProps> => ({
  firstButtonOnClick: () => {
    dispatch(toggleClearDataDialog(false));
    dispatch(clearAllData());
    dispatch(refresh());
  },
  secondButtonOnClick: () => {
    dispatch(toggleClearDataDialog(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClearDataDialog);
