import React from 'react';
import { Trans } from '@lingui/macro';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import {
  toggleLoginDialog,
  toggleLogoutDialog,
  clearAllData,
  loggedOut,
  refreshCardList,
  setCardFilter,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeStoredCredential } from '../../utils/storage';

const LogoutDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showLogoutDialog);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>退出登录</Trans>
      </DialogTitle>
      <DialogContent>
        <Trans>您确认要退出登录吗？如果只是更换登录密码，请不要选择清除数据。</Trans>
      </DialogContent>
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
          <Trans>退出</Trans>
        </Button>
        <Button
          color="primary"
          onClick={async () => {
            await removeStoredCredential();
            dispatch(toggleLogoutDialog(false));
            dispatch(loggedOut());
            dispatch(clearAllData());
            dispatch(setCardFilter({}));
            dispatch(refreshCardList());
            dispatch(toggleLoginDialog(true));
          }}
        >
          <Trans>退出并清除数据</Trans>
        </Button>
        <Button color="primary" onClick={() => dispatch(toggleLogoutDialog(false))}>
          <Trans>取消</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
