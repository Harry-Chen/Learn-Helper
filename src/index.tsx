import React from 'react';
import ReactDOM from 'react-dom';

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
import { LoginDialog } from './components/LoginDialog';
import * as SideBar from './constants/SideBarItems';
import * as PlaceHolder from './constants/PlaceHolder';
import { SnackbarType } from './types/Dialogs';

import styles from './css/index.css';
import { NetworkErrorDialog } from './components/NetworkErrorDialog';

const initialState = {
  paneHidden: false,
  loading: true,
  loadProgress: 75,
  showSnackBar: false,
  snackbarContent: '',
  snackbarType: SnackbarType.ERROR,
};

class App extends React.Component<{}, typeof initialState> {

  constructor(prop) {
    super(prop);
    this.state = initialState;
  }

  public render() {

    return (
        <div>
          <div
              className={
                classnames(styles.paneFolder, { [styles.paneHidden]: this.state.paneHidden })
              }
          >
            <NumberedList
                name="通知汇总"
                icon="thumbtack"
                items={SideBar.SUMMARY_FUNC_LIST}
                numbers={PlaceHolder.TEST_NUMBER_LIST}
            />
            <Divider/>
            <ExpandableList
                name="本学期课程"
                icon="inbox"
                courses={PlaceHolder.TEST_COURSE_LIST}
                functions={SideBar.COURSE_FUNC_LIST}
            />
            <Divider/>
            <NumberedList
                name="设置"
                icon="wrench"
                items={SideBar.SETTINGS_FUNC_LIST}
                numbers={[]}
            />
          </div>
          <div
              className={
                classnames(styles.paneMessage, { [styles.paneHidden]: this.state.paneHidden })
              }
          >
            <CardList
                title="主页"
                items={PlaceHolder.TEST_CARD_INFO_LIST}
            />
          </div>
          <div
              className={
                classnames(styles.paneContent, { [styles.paneFullscreen]: this.state.paneHidden })
              }
          >
            <ToggleButton
                handler={this.toggleButtonHandler}
            />
            <Iframe
                url="welcome.html"
            />
          </div>
          <div className={styles.progress_area}>
            <LinearProgress
                variant="determinate"
                value={this.state.loadProgress}
                hidden={!this.state.loading}
            />
          </div>
          <LoginDialog
              shouldOpen={true}
              loginHandler={this.doLogin}
              snackbarHandler={this.setSnackbar}
          />
          <NetworkErrorDialog
              shouldOpen={true}
              snackbarHandler={this.setSnackbar}
              refreshHandler={this.doRefresh}
              offlineHandler={this.enterOfflineMode}
          />
          <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={this.state.showSnackBar}
              autoHideDuration={1000}
              onClose={() => { this.setState({ showSnackBar: false }); }}
          >
            <SnackbarContent
                className={this.snackbarClass(this.state.snackbarType)}
                message={
                  <span id="client-snackbar" className={styles.snack_bar_text}>
                    {this.state.snackbarContent}
                  </span>
                }
            />
          </Snackbar>
        </div>);
  }

  private toggleButtonHandler = () => {
    this.setState({ paneHidden: !this.state.paneHidden });
  };

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

  private setSnackbar = (message: string, type: SnackbarType) => {
    this.setState({
      showSnackBar: true,
      snackbarContent: message,
      snackbarType: type,
    });
  }

  private doLogin = async (username: string, password: string, save: boolean) => {
    return new Promise(resolve =>
        setTimeout(() => resolve(true), 1000)
    ) as Promise<boolean>;
  }

  private doRefresh = () => {
    console.log('Will refresh');
  }

  private enterOfflineMode = () => {
    this.setState({ loading: false });
  }

}

ReactDOM.render(<App />, document.querySelector('#index'));
