import React from 'react';
import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLoginDialog, toggleNetworkErrorDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { loggedIn, refresh } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';
import { requestPermission } from '../../utils/permission';
import { t, tr } from '../../utils/i18n';

import CommonDialog from './CommonDialog';

class NetworkErrorDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => ({
  open: (state[STATE_UI] as UiState).showNetworkErrorDialog,
  title: t('NetworkErrorDialog_Title'),
  content: tr('NetworkErrorDialog_Content'),
  firstButton: t('NetworkErrorDialog_Refresh'),
  secondButton: t('NetworkErrorDialog_Offline'),
  thirdButton: t('NetworkErrorDialog_UpdateCredential'),
});

const mapDispatchToProps = (dispatch): Partial<ICommonDialogProps> => ({
  firstButtonOnClick: async () => {
    await requestPermission();
    dispatch(toggleNetworkErrorDialog(false));
    dispatch(refresh());
  },
  secondButtonOnClick: () => {
    dispatch(toggleNetworkErrorDialog(false));
    dispatch(loggedIn());
  },
  thirdButtonOnClick: () => {
    dispatch(toggleNetworkErrorDialog(false));
    dispatch(toggleLoginDialog(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NetworkErrorDialog);
