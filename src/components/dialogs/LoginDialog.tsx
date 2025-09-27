import { Trans } from '@lingui/react/macro';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import IconArrowUpRightFromSquare from '~icons/fa6-solid/arrow-up-right-from-square';

import { LEARN_TSINGHUA_LOGIN_URL } from '../../constants';
import { loggedIn, login, refresh, toggleLoginDialog } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const LoginDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showLoginDialog);
  const inLoginProgress = useAppSelector((state) => state.ui.inLoginProgress);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>登录网络学堂</Trans>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Trans>
            您需要登录网络学堂才能使用本插件的功能。
            <br />
            <br />
            请注意：本插件默认不会保存您的凭据；您需要在登录页面手动选择启用自动登录功能。
            <br />
            如果您选择启用自动登录功能，则本插件会将您的凭据保存在<b>本地</b>。
            <br />
            我们对凭据进行了简单的加密，但并不能完全防止其被第三方读取。在长时间不使用或者出借计算机时，请务必退出登录，以免您的凭据被泄露。
            <br />
            <br />
            如果您选择登录，则视为您已经阅读并同意
            <a href="about.html" target="_blank" rel="noreferrer">
              此页面
            </a>
            中的所有内容。否则，请立刻停止使用并从浏览器中卸载本插件。
          </Trans>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {inLoginProgress && <CircularProgress size={30} variant="indeterminate" />}
        <Button
          color="primary"
          href={LEARN_TSINGHUA_LOGIN_URL}
          target="_blank"
          rel="noreferrer"
          startIcon={<IconArrowUpRightFromSquare width={20} />}
        >
          <Trans>跳转到网络学堂登录页面</Trans>
        </Button>
        <Button
          color="primary"
          disabled={inLoginProgress}
          onClick={async () => {
            try {
              await dispatch(login());
              await dispatch(refresh());
            } catch (e) {
              // here we catch only login problems
              // for refresh() has a try-catch block in itself
              console.error(e);
            }
          }}
          type="submit"
        >
          <Trans>刷新登录状态</Trans>
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            dispatch(toggleLoginDialog(false));
            dispatch(loggedIn());
          }}
        >
          <Trans>离线查看</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
