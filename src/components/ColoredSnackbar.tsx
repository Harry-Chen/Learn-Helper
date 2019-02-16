import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { toggleSnackbar } from '../redux/actions/ui';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import styles from '../css/main.css';
import { SnackbarType } from '../types/dialogs';
import { IUiStateSlice, STATE_UI } from '../redux/reducers';
import { UiState } from '../redux/reducers/ui';
import { ColoredSnackbarProps } from '../types/ui';
import { connect } from 'react-redux';

class ColoredSnackbar extends React.Component<ColoredSnackbarProps, never> {
  public render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={this.props.showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          this.props.dispatch(toggleSnackbar(false));
        }}
      >
        <SnackbarContent
          className={snackbarClass(this.props.snackbarType)}
          message={
            <span id="client-snackbar" className={styles.snack_bar_text}>
                {this.props.snackbarContent}
              </span>
          }
        />
      </Snackbar>
    );
  }
}

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

const mapStateToProps = (state: IUiStateSlice): ColoredSnackbarProps => {
  const uiState = state[STATE_UI] as UiState;
  return {
    snackbarContent: uiState.snackbarContent,
    snackbarType: uiState.snackbarType,
    showSnackbar: uiState.showSnackbar,
  };
};

export default connect(mapStateToProps)(ColoredSnackbar);
