import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  TextField,
} from '@mui/material';

import { toggleLoginDialog, login, refresh } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { requestPermission } from '../../utils/permission';
import { t, tr } from '../../utils/i18n';

const LoginDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showLoginDialog);
  const inLoginProgress = useAppSelector((state) => state.ui.inLoginProgress);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [save, setSave] = useState(false);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>{t('LoginDialog_Title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{tr('LoginDialog_Content')}</DialogContentText>
      </DialogContent>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          id="username"
          label={t('LoginDialog_Username')}
          type="text"
          required
          multiline={false}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          margin="dense"
          id="password"
          label={t('LoginDialog_Password')}
          type="password"
          required
          multiline={false}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox id="saveCredential" onChange={(e) => setSave(e.target.checked)} />}
          label={t('LoginDialog_SaveCredential')}
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
              dispatch(toggleLoginDialog(true));
            }
          }}
          type="submit"
        >
          {t('Common_Ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
