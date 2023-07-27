import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLoginDialog, toggleLogoutDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { clearAllData } from '../../redux/actions/data';
import { loggedOut } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';
import { removeStoredCredential } from '../../utils/storage';
import { t } from '../../utils/i18n';

import CommonDialog from './CommonDialog';

class LogoutDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => ({
  open: (state[STATE_UI] as UiState).showLogoutDialog,
  title: t('LogoutDialog_Title'),
  content: t('LogoutDialog_Content'),
  firstButton: t('LogoutDialog_Logout'),
  secondButton: t('LogoutDialog_LogoutAndClearData'),
  thirdButton: t('Common_Cancel'),
});

const mapDispatchToProps = (dispatch): Partial<ICommonDialogProps> => ({
  firstButtonOnClick: () => {
    dispatch(async (_dispatch) => {
      await removeStoredCredential();
      _dispatch(toggleLogoutDialog(false));
      _dispatch(loggedOut());
      _dispatch(toggleLoginDialog(true));
    });
  },
  secondButtonOnClick: () => {
    dispatch(async (_dispatch) => {
      await removeStoredCredential();
      _dispatch(toggleLogoutDialog(false));
      _dispatch(loggedOut());
      _dispatch(clearAllData());
      _dispatch(toggleLoginDialog(true));
    });
  },
  thirdButtonOnClick: () => {
    dispatch(toggleLogoutDialog(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutDialog);
