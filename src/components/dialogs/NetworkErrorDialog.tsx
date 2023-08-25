import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import {
  toggleLoginDialog,
  toggleNetworkErrorDialog,
  loggedIn,
  refresh,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { requestPermission } from '../../utils/permission';
import { t, tr } from '../../utils/i18n';

const NetworkErrorDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showNetworkErrorDialog);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>{t('NetworkErrorDialog_Title')}</DialogTitle>
      <DialogContent>{tr('NetworkErrorDialog_Content')}</DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={async () => {
            await requestPermission();
            dispatch(toggleNetworkErrorDialog(false));
            dispatch(refresh());
          }}
        >
          {t('NetworkErrorDialog_Refresh')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNetworkErrorDialog(false));
            dispatch(loggedIn());
          }}
        >
          {t('NetworkErrorDialog_Offline')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNetworkErrorDialog(false));
            dispatch(toggleLoginDialog(true));
          }}
        >
          {t('NetworkErrorDialog_UpdateCredential')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetworkErrorDialog;
