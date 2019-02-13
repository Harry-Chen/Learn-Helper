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

import NumberedList from './components/NumberedList';
import ExpandableList from './components/ExpandableList';
import ToggleButton from './components/ToggleButton';
import CardList from './components/CardList';
import LoginDialog from './components/LoginDialog';
import NetworkErrorDialog from './components/NetworkErrorDialog';
import * as SideBar from './constants/function';
import * as PlaceHolder from './constants/placeholder';
import { SnackbarType } from './types/dialogs';

import reduxStore from './redux/store';

import styles from './css/index.css';
import { IUiStateSlice, STATE_UI } from './redux/reducers';
import { AppProp } from './types/app';
import { toggleLoginDialog, togglePane, toggleSnackbar } from './redux/actions/ui';
import { STORAGE_KEY_PASSWORD, STORAGE_KEY_USERNAME, STORAGE_SALT } from './constants';
import { decipher } from './utils/crypto';
import { login, refresh } from './redux/actions/helper';
import NewSemesterDialog from './components/NewSemesterDialog';

class AppImpl extends React.Component<AppProp, never> {
  public render() {
    return (
      <div>
        <div
          className={classnames(styles.paneFolder, { [styles.paneHidden]: this.props.paneHidden })}
        >
          <NumberedList
            name="通知汇总"
            icon="thumbtack"
            items={SideBar.SUMMARY_FUNC_LIST}
            numbers={PlaceHolder.TEST_NUMBER_LIST}
          />
          <Divider />
          <ExpandableList
            name="本学期课程"
            icon="inbox"
            courses={PlaceHolder.TEST_COURSE_LIST}
            functions={SideBar.COURSE_FUNC_LIST}
          />
          <Divider />
          <NumberedList name="设置" icon="wrench" items={SideBar.SETTINGS_FUNC_LIST} numbers={[]} />
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
          <ToggleButton
            handler={() => {
              store.dispatch(togglePane(!this.props.paneHidden));
            }}
          />
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

chrome.storage.local.get([STORAGE_KEY_USERNAME, STORAGE_KEY_PASSWORD], res => {
  let username = res[STORAGE_KEY_USERNAME];
  let password = res[STORAGE_KEY_PASSWORD];
  if (username !== undefined && password !== undefined) {
    const decipherImpl = decipher(STORAGE_SALT);
    username = decipherImpl(username);
    password = decipherImpl(password);
    store.dispatch<any>(login(username, password, false)).then(() => {
      store.dispatch<any>(refresh());
    });
  } else {
    store.dispatch(toggleLoginDialog(true));
  }
});
