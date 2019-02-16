import React from 'react';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import LinearProgress from '@material-ui/core/LinearProgress';

import { AppProp } from '../types/app';
import { SnackbarType } from '../types/dialogs';
import { toggleSnackbar } from '../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../redux/reducers';
import styles from '../css/main.css';

import SummaryList from './SummaryList';
import CourseList from './CourseList';
import SettingList from './SettingList';
import CardList from './CardList';
import ToggleButton from './ToggleButton';
import LoginDialog from './dialogs/LoginDialog';
import NetworkErrorDialog from './dialogs/NetworkErrorDialog';
import NewSemesterDialog from './dialogs/NewSemesterDialog';
import ClearDataDialog from './dialogs/ClearDataDialog';
import LogoutDialog from './dialogs/LogoutDialog';

class App extends React.Component<AppProp, never> {
  public render() {
    return (
      <div>
        <div
          className={classnames(styles.paneFolder, { [styles.paneHidden]: this.props.paneHidden })}
        >
          <SummaryList />
          <Divider />
          <CourseList />
          <Divider />
          <SettingList />
        </div>
        <div
          className={classnames(styles.paneMessage, { [styles.paneHidden]: this.props.paneHidden })}
        >
          <CardList />
        </div>
        <div
          className={classnames(styles.paneContent, {
            [styles.paneFullscreen]: this.props.paneHidden,
          })}
        >
          <ToggleButton />
          <Iframe url="welcome.html" />
        </div>
        <div className={styles.progress_area}>
          <LinearProgress
            variant="determinate"
            value={this.props.loadingProgress}
            hidden={!this.props.showLoadingProgressBar}
          />
        </div>

        <LoginDialog />
        <NetworkErrorDialog />
        <NewSemesterDialog />
        <ClearDataDialog />
        <LogoutDialog />

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.props.showSnackbar}
          autoHideDuration={3000}
          onClose={() => {
            this.props.dispatch(toggleSnackbar(false));
          }}
        >
          <SnackbarContent
            className={this.snackbarClass(this.props.snackbarType)}
            message={
              <span id="client-snackbar" className={styles.snack_bar_text}>
                {this.props.snackbarContent}
              </span>
            }
          />
        </Snackbar>
      </div>
    );
  }

  private snackbarClass = (type: SnackbarType) => {
    switch (type) {
      case SnackbarType.ERROR:
        return styles.snack_bar_error;
      case SnackbarType.NOTIFICATION:
        return styles.snack_bar_notification;
      case SnackbarType.SUCCESS:
        return styles.snack_bar_success;
    }
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<AppProp> => {
  return state[STATE_UI];
};

export default connect(mapStateToProps)(App);
