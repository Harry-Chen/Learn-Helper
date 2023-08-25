import React from 'react';

import { Snackbar, SnackbarContent } from '@mui/material';

import styles from '../css/main.module.css';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { SnackbarType } from '../types/ui';
import { setSnackbar } from '../redux/actions';

const ColoredSnackbar = () => {
  const dispatch = useAppDispatch();

  const snackbar = useAppSelector((state) => state.ui.snackbar);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={!!snackbar}
      autoHideDuration={3000}
      onClose={() => {
        dispatch(setSnackbar());
      }}
    >
      {snackbar && (
        <SnackbarContent
          className={snackbarClass(snackbar.type)}
          message={
            <span id="client-snackbar" className={styles.snack_bar_text}>
              {snackbar.content}
            </span>
          }
        />
      )}
    </Snackbar>
  );
};

const snackbarClass = (type: SnackbarType) => {
  switch (type) {
    case SnackbarType.ERROR:
      return styles.snack_bar_error;
    case SnackbarType.NOTIFICATION:
      return styles.snack_bar_notification;
    case SnackbarType.SUCCESS:
      return styles.snack_bar_success;
  }
};

export default ColoredSnackbar;
