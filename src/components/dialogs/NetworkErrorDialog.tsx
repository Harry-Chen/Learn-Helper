import { Trans } from '@lingui/macro';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import {
  toggleLoginDialog,
  toggleNetworkErrorDialog,
  loggedIn,
  refresh,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { requestPermission } from '../../utils/permission';

const NetworkErrorDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showNetworkErrorDialog);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>刷新课程信息失败</Trans>
      </DialogTitle>
      <DialogContent>
        <Trans>
          可能原因有：
          <br />
          · 网络不太给力
          <br />
          · 服务器去思考人生了
          <br />
          · 保存的用户凭据不正确（最近修改过密码？）
          <br />
          您可以选择重试、放弃刷新，或者更换新的凭据。
        </Trans>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={async () => {
            await requestPermission();
            dispatch(toggleNetworkErrorDialog(false));
            dispatch(refresh());
          }}
        >
          <Trans>重试刷新</Trans>
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNetworkErrorDialog(false));
            dispatch(loggedIn());
          }}
        >
          <Trans>离线查看</Trans>
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNetworkErrorDialog(false));
            dispatch(toggleLoginDialog(true));
          }}
        >
          <Trans>更新凭据</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetworkErrorDialog;
