import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import { toggleClearDataDialog, clearAllData, refresh } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { t } from '../../utils/i18n';

const ClearDataDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showClearDataDialog);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>{t('ClearDataDialog_Title')}</DialogTitle>
      <DialogContent>{t('ClearDataDialog_Content')}</DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleClearDataDialog(false));
            dispatch(clearAllData());
            dispatch(refresh());
          }}
        >
          {t('Common_Yes')}
        </Button>
        <Button color="primary" onClick={() => dispatch(toggleClearDataDialog(false))}>
          {t('Common_No')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClearDataDialog;
