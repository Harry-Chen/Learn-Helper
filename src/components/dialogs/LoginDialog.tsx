import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { login, refresh } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { requestPermission } from '../../utils/permission';

const LoginDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showLoginDialog);
  const inLoginProgress = useAppSelector((state) => state.ui.inLoginProgress);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [save, setSave] = useState(false);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>登录网络学堂</Trans>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Trans>
            请输入您的学号/用户名和密码以登录到网络学堂。
            <br />
            请注意，本插件默认不会保存您的凭据；每次打开新的学堂助手页面时，您都需要重新输入。
            如果您选择保存凭据，则本插件会将其 <b>保存在本地</b> ，并启用自动登录功能。
            <br />
            我们对凭据进行了简单的加密，但并不能完全防止其被第三方读取。
            在长时间不使用或者出借计算机时，请务必退出登录，以免您的凭据被泄露。
            <br />
            如果您选择登录，则视为您已经阅读并同意
            <a href="about.html" target="_blank" rel="noreferrer">
              此页面
            </a>
            中的所有内容。否则，请立刻停止使用并从浏览器中卸载本插件。
          </Trans>
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label={t`用户名/学号`}
          type="text"
          required
          multiline={false}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          margin="dense"
          label={t`密码`}
          type="password"
          required
          multiline={false}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox onChange={(e) => setSave(e.target.checked)} />}
          label={t`保存凭据以自动登录`}
        />
      </DialogContent>
      <DialogActions>
        {inLoginProgress && <CircularProgress size={30} variant="indeterminate" />}
        <Button
          color="primary"
          disabled={inLoginProgress}
          onClick={async () => {
            try {
              await requestPermission();
              await dispatch(login(username, password, save));
              await dispatch(refresh());
            } catch (e) {
              // here we catch only login problems
              // for refresh() has a try-catch block in itself
              console.error(e);
            }
          }}
          type="submit"
        >
          <Trans>确定</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
