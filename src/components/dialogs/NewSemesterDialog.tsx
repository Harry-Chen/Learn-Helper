import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import {
  toggleIgnoreWrongSemester,
  toggleNewSemesterDialog,
  insistSemester,
  syncSemester,
  refresh,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { formatSemester } from '../../utils/format';
import { t, tr } from '../../utils/i18n';

const NewSemesterDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showNewSemesterDialog);
  const semester = useAppSelector((state) => state.data.semester);
  const fetchedSemester = useAppSelector((state) => state.data.fetchedSemester);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>{t('NewSemesterDialog_Title')}</DialogTitle>
      <DialogContent>
        {tr('NewSemesterDialog_Content', [
          formatSemester(semester),
          formatSemester(fetchedSemester),
        ])}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNewSemesterDialog(false));
            dispatch(syncSemester());
            dispatch(refresh());
          }}
        >
          {t('Common_Yes')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNewSemesterDialog(false));
            dispatch(toggleIgnoreWrongSemester(true));
            dispatch(refresh());
          }}
        >
          {t('Common_No')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNewSemesterDialog(false));
            dispatch(insistSemester(true));
            dispatch(refresh());
          }}
        >
          {t('Common_NoAskAgain')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSemesterDialog;
