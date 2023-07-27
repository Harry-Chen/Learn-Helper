import React from 'react';
import { connect } from 'react-redux';

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

import { ILoginDialogProps } from '../../types/dialogs';

import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { toggleLoginDialog } from '../../redux/actions/ui';
import { login, refresh } from '../../redux/actions/helper';
import { requestPermission } from '../../utils/permission';
import { t, tr } from '../../utils/i18n';

class LoginDialog extends React.PureComponent<ILoginDialogProps, never> {
  private username = '';

  private password = '';

  private save = false;

  constructor(prop: ILoginDialogProps) {
    super(prop);
  }

  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open} keepMounted>
        <DialogTitle>
          {t('LoginDialog_Title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {tr('LoginDialog_Content')}
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            id="username"
            label={t('LoginDialog_Username')}
            type="text"
            required
            multiline={false}
            onChange={(e) => {
              this.username = e.target.value;
            }}
          />
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            id="password"
            label={t('LoginDialog_Password')}
            type="password"
            required
            multiline={false}
            onChange={(e) => {
              this.password = e.target.value;
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="saveCredential"
                onChange={(e) => {
                  this.save = e.target.checked;
                }}
              />
            }
            label={t('LoginDialog_SaveCredential')}
          />
        </DialogContent>
        <DialogActions>
          {this.props.inLoginProgress ? (
            <CircularProgress size={30} variant="indeterminate" />
          ) : null}
          <Button
            color="primary"
            disabled={this.props.inLoginProgress}
            onClick={async () => {
              try {
                await requestPermission();
                await this.props.dispatch<any>(login(this.username, this.password, this.save));
                await this.props.dispatch<any>(refresh());
              } catch (e) {
                // here we catch only login problems
                // for refresh() has a try-catch block in itself
                console.log(e);
                this.props.dispatch<any>(toggleLoginDialog(true));
              }
            }}
            type="submit"
          >
            {t('Common_Ok')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<ILoginDialogProps> => {
  const uiState = state[STATE_UI];
  return {
    open: uiState.showLoginDialog,
    inLoginProgress: uiState.inLoginProgress,
  };
};

export default connect(mapStateToProps)(LoginDialog);
