import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import Iframe from 'react-iframe';
import classnames from 'classnames';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import SummaryList from './components/SummaryList';
import SettingList from './components/SettingList';
import CourseList from './components/CourseList';
import ToggleButton from './components/ToggleButton';
import CardList from './components/CardList';
import * as SideBar from './constants/function';
import * as PlaceHolder from './constants/placeholder';
import {
  LoginDialog,
  LogoutDialog,
  NetworkErrorDialog,
  NewSemesterDialog,
  ClearDataDialog,
} from './components/dialogs';
import { SnackbarType } from './types/dialogs';

import reduxStore from './redux/store';

import styles from './css/index.css';
import { IUiStateSlice, STATE_UI } from './redux/reducers';
import { AppProp } from './types/app';
import {
  toggleLoginDialog,
  toggleNetworkErrorDialog,
  toggleSnackbar,
} from './redux/actions/ui';
import { login, refresh } from './redux/actions/helper';
import { getStoredCredential } from './utils/storage';

class AppImpl extends React.Component<AppProp, never> {
  public render() {
    return (
      <div>
        <div
          className={classnames(styles.paneFolder, { [styles.paneHidden]: this.props.paneHidden })}
        >
          <SummaryList/>
          <Divider />
          <CourseList
            name="本学期课程"
            icon="inbox"
            courses={PlaceHolder.TEST_COURSE_LIST}
          />
          <Divider />
          <SettingList />
        </div>
        <div
          className={classnames(styles.paneMessage, { [styles.paneHidden]: this.props.paneHidden })}
        >
          <CardList title="主页" items={PlaceHolder.TEST_CARD_INFO_LIST} />
        </div>
        <div
          className={classnames(styles.paneContent, {
            [styles.paneFullscreen]: this.props.paneHidden,
          })}
        >
          <ToggleButton/>
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
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.props.showSnackbar}
          autoHideDuration={1000}
          onClose={() => {
            store.dispatch(toggleSnackbar(false));
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
  };
}

const mapStateToProps = (state: IUiStateSlice): Partial<AppProp> => {
  return state[STATE_UI];
};

const App = connect(mapStateToProps)(AppImpl);

const { store, persistor } = reduxStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.querySelector('#index'),
);

getStoredCredential()
  .then(res => {
    if (res === null) {
      store.dispatch(toggleLoginDialog(true));
    } else {
      store.dispatch<any>(login(res.username, res.password, false))
        .then(() => { store.dispatch<any>(refresh()); })
        .catch(() => {
          store.dispatch(toggleLoginDialog(false));
          store.dispatch(toggleNetworkErrorDialog(true));
        });
    }
  });
