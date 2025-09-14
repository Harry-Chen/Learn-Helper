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
import { resetApp, toggleLoginDialog, toggleLogoutDialog } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

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
        <Trans>您确认要退出登录吗？</Trans>
        <br />
        <FormControlLabel
          control={<Checkbox checked={full} onChange={(e) => setFull(e.target.checked)} />}
          label={t`一并登出用户电子身份服务系统（统一登录）`}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={async () => {
            await dispatch(resetApp());
            await helper.logout(full);
            dispatch(toggleLogoutDialog(false));
            dispatch(toggleLoginDialog(true));
          }}
        >
          <Trans>退出</Trans>
        </Button>
        <Button color="primary" onClick={() => dispatch(toggleLogoutDialog(false))}>
          <Trans>取消</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
