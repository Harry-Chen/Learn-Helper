import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import {
  toggleLoginDialog,
  toggleLogoutDialog,
  clearAllData,
  loggedOut,
  refreshCardList,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeStoredCredential } from '../../utils/storage';
import { t } from '../../utils/i18n';

const LogoutDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showLogoutDialog);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>{t('LogoutDialog_Title')}</DialogTitle>
      <DialogContent>{t('LogoutDialog_Content')}</DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={async () => {
            await removeStoredCredential();
            dispatch(toggleLogoutDialog(false));
            dispatch(loggedOut());
            dispatch(toggleLoginDialog(true));
          }}
        >
          {t('LogoutDialog_Logout')}
        </Button>
        <Button
          color="primary"
          onClick={async () => {
            await removeStoredCredential();
            dispatch(toggleLogoutDialog(false));
            dispatch(loggedOut());
            dispatch(clearAllData());
            dispatch(refreshCardList());
            dispatch(toggleLoginDialog(true));
          }}
        >
          {t('LogoutDialog_LogoutAndClearData')}
        </Button>
        <Button color="primary" onClick={() => dispatch(toggleLogoutDialog(false))}>
          {t('Common_Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
