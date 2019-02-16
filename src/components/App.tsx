import React from 'react';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import { AppProps } from '../types/ui';
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
import ColoredSnackbar from './ColoredSnackbar';
import { UiState } from '../redux/reducers/ui';

class App extends React.PureComponent<AppProps, never> {
  public render() {
    return (
      <div>
        {/* sidebar */}
        <div
          className={classnames(styles.paneFolder, { [styles.paneHidden]: this.props.paneHidden })}
        >
          <SummaryList />
          <Divider />
          <CourseList />
          <Divider />
          <SettingList />
        </div>
        {/* list of cards */}
        <div
          className={classnames(styles.paneMessage, { [styles.paneHidden]: this.props.paneHidden })}
        >
          <CardList />
        </div>
        {/* detail area */}
        <div
          className={classnames(styles.paneContent, {
            [styles.paneFullscreen]: this.props.paneHidden,
          })}
        >
          <ToggleButton />
          <Iframe url="welcome.html" />
        </div>
        {/* progress bar */}
        <div className={styles.progress_area}>
          <LinearProgress
            variant="determinate"
            value={this.props.loadingProgress}
            hidden={!this.props.showLoadingProgressBar}
          />
        </div>
        {/* dialogs */}
        <LoginDialog />
        <NetworkErrorDialog />
        <NewSemesterDialog />
        <ClearDataDialog />
        <LogoutDialog />
        {/* snackbar for notification */}
        <ColoredSnackbar />
      </div>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): AppProps => {
  const uiState = state[STATE_UI] as UiState;
  return {
    showLoadingProgressBar: uiState.showLoadingProgressBar,
    loadingProgress: uiState.loadingProgress,
    paneHidden: uiState.paneHidden,
  };
};

export default connect(mapStateToProps)(App);
