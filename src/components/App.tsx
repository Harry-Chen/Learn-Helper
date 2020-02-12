import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppProps } from '../types/ui';
import { IUiStateSlice, STATE_DATA, STATE_HELPER, STATE_UI } from '../redux/reducers';
import { setTitleFilter, togglePaneHidden } from '../redux/actions/ui';
import styles from '../css/main.css';
import '../css/scrollbar.css';

import SummaryList from './SummaryList';
import CourseList from './CourseList';
import SettingList from './SettingList';
import CardList from './CardList';
import {
  ClearDataDialog,
  LoginDialog,
  LogoutDialog,
  NetworkErrorDialog,
  NewSemesterDialog,
} from './dialogs';
import ColoredSnackbar from './ColoredSnackbar';
import { UiState } from '../redux/reducers/ui';
import DetailPane from './DetailPane';
import { DataState } from '../redux/reducers/data';
import { formatSemester } from '../utils/format';
import { HelperState } from '../redux/reducers/helper';
import { clearAllData } from '../redux/actions/data';
import { removeStoredCredential } from '../utils/storage';

const initialState = {
  filterShown: false,
  filter: '',
  hasError: false,
  lastError: new Error(),
  lastErrorInfo: undefined,
};

class App extends React.PureComponent<AppProps, typeof initialState> {
  public state = initialState;

  private inputRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidCatch(error, info) {
    this.setState({ hasError: true, lastError: error, lastErrorInfo: info });
  }

  private toggleFilter = () => {
    if (this.state.filterShown) {
      this.setState({
        filterShown: false,
        filter: '',
      });
      this.props.setTitleFilter('');
    } else {
      setTimeout(() => this.inputRef.current.focus(), 250);
      this.setState({
        filterShown: true,
      });
    }
  };

  private handleFilter = ev => {
    this.setState({ filter: ev.target.value });
    this.props.setTitleFilter(ev.target.value);
  };

  private filterBlur = () => {
    if (this.state.filterShown && this.state.filter === '') {
      this.setState({ filterShown: false });
    }
  };

  public render() {
    if (!this.state.hasError) {
      return (
        <main>
          <CssBaseline />
          {/* sidebar */}
          <AppBar position="fixed">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                className={classnames(styles.app_bar_btn)}
                onClick={this.props.openSidebar}
              >
                <FontAwesomeIcon icon="bars" />
              </IconButton>
            </Toolbar>
          </AppBar>
          {/* progress bar */}
          <header className={styles.progress_area}>
            <LinearProgress
              variant="determinate"
              color={'secondary'}
              value={this.props.loadingProgress}
              hidden={!this.props.showLoadingProgressBar}
            />
          </header>
          <Drawer
            className={styles.sidebar}
            variant="persistent"
            anchor="left"
            open={!this.props.paneHidden}
          >
            <nav className={styles.sidebar_wrapper}>
              <header className={styles.sidebar_header}>
                <div className={styles.sidebar_header_content}>
                  <Toolbar className={styles.sidebar_header_left}>
                    <IconButton
                      className={classnames(styles.app_bar_btn)}
                      onClick={this.props.closeSidebar}
                    >
                      <FontAwesomeIcon icon="angle-left" />
                    </IconButton>
                    <Typography
                      variant="subtitle1"
                      className={styles.sidebar_master_title}
                      noWrap={true}
                    >
                      {this.props.semesterTitle}
                    </Typography>
                  </Toolbar>
                  <Toolbar
                    className={classnames(styles.sidebar_header_right, {
                      [styles.sidebar_filter_shown]: this.state.filterShown,
                    })}
                  >
                    <Typography variant="h6" className={styles.sidebar_cardlist_name} noWrap={true}>
                      {this.props.cardListTitle}
                    </Typography>

                    <div className={styles.sidebar_filter_group}>
                      <IconButton
                        className={classnames(styles.filter_btn)}
                        onClick={this.toggleFilter}
                      >
                        <FontAwesomeIcon
                          icon="filter"
                          className={classnames(styles.filter_icon, {
                            [styles.filter_icon_shown]: !this.state.filterShown,
                          })}
                        />
                        <FontAwesomeIcon
                          icon="times"
                          className={classnames(styles.filter_icon, {
                            [styles.filter_icon_shown]: this.state.filterShown,
                          })}
                        />
                      </IconButton>
                      <div className={styles.filter_input}>
                        <InputBase
                          inputRef={this.inputRef}
                          className={styles.filter_input_inner}
                          placeholder="筛选"
                          value={this.state.filter}
                          onChange={this.handleFilter}
                          inputProps={{
                            onBlur: this.filterBlur,
                          }}
                        />
                      </div>
                    </div>
                  </Toolbar>
                </div>
              </header>
              <section className={styles.sidebar_content}>
                <nav className={classnames(styles.sidebar_component, styles.sidebar_folder)}>
                  <SummaryList />
                  <Divider />
                  <CourseList />
                  <Divider />
                  <SettingList />
                </nav>
                {/* list of cards */}
                <nav className={classnames(styles.sidebar_component, styles.sidebar_cards)}>
                  <CardList />
                </nav>
              </section>
            </nav>
          </Drawer>
          {/* detail area */}
          <aside
            className={classnames(styles.pane_content, {
              [styles.pane_fullscreen]: this.props.paneHidden,
            })}
          >
            <Toolbar />
            <DetailPane />
          </aside>
          {/* dialogs */}
          <LoginDialog />
          <NetworkErrorDialog />
          <NewSemesterDialog />
          <ClearDataDialog />
          <LogoutDialog />
          {/* snackbar for notification */}
          <ColoredSnackbar />
        </main>
      );
    }
    return (
      <main className={styles.app_error_section}>
        <Typography variant="h5" className={styles.app_error_text} noWrap={true}>
          <b>哎呀，出错了！</b>
        </Typography>
        <Typography variant="body1" className={styles.app_error_text} noWrap={true}>
          发生了不可恢复的错误，如果刷新页面无法解决，请点击下面的按钮重新来过。
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          className={styles.app_error_text}
          onClick={this.props.resetApp}
        >
          清除数据
        </Button>
        <Typography variant="body1" className={styles.app_error_text}>
          <b>请将下面的错误信息发送给开发者，以协助解决问题，感谢支持！</b>
        </Typography>
        <Typography variant="body1" className={styles.app_error_text}>
          错误信息：
          <br />
          <code>{this.state.lastError.stack}</code>
        </Typography>
        <Typography variant="body1" className={styles.app_error_text}>
          错误组件：
          <code>{this.state.lastErrorInfo.componentStack}</code>
        </Typography>
      </main>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<AppProps> => {
  const uiState = state[STATE_UI] as UiState;
  const dataState = state[STATE_DATA] as DataState;
  const helperState = state[STATE_HELPER] as HelperState;
  return {
    showLoadingProgressBar: uiState.showLoadingProgressBar,
    loadingProgress: uiState.loadingProgress,
    paneHidden: uiState.paneHidden,
    cardListTitle: helperState.loggedIn ? uiState.cardListTitle : '加载中...',
    semesterTitle: formatSemester(dataState.semester),
  };
};

const mapDispatchToProps = (dispatch): Partial<AppProps> => ({
  openSidebar: () => dispatch(togglePaneHidden(false)),
  closeSidebar: () => dispatch(togglePaneHidden(true)),
  setTitleFilter: (s: string) => {
    const filter = s.trim();
    dispatch(setTitleFilter(filter === '' ? undefined : filter));
  },
  resetApp: async () => {
    // clear all data
    await removeStoredCredential();
    dispatch(clearAllData());
    // refresh page
    window.location = window.location;
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
