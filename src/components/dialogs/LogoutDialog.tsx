import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';
import { useState } from 'react';
import {
  clearAllData,
  loggedOut,
  refreshCardList,
  setCardFilter,
  toggleLoginDialog,
  toggleLogoutDialog,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeStoredCredential } from '../../utils/storage';

const LogoutDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showLogoutDialog);
  const helper = useAppSelector((state) => state.helper.helper);
  const [full, setFull] = useState(false);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>退出登录</Trans>
      </DialogTitle>
      <DialogContent>
        <Trans>您确认要退出登录吗？如果只是更换登录密码，请不要选择清除数据。</Trans>
        <FormControlLabel
          control={<Checkbox checked={full} onChange={(e) => setFull(e.target.checked)} />}
          label={t`一并登出用户电子身份服务系统（统一登录）`}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={async () => {
            await removeStoredCredential();
            dispatch(toggleLogoutDialog(false));
            helper.logout(full);
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
            helper.logout(full);
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
