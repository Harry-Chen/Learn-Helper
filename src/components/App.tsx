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
};

class App extends React.PureComponent<AppProps, typeof initialState> {
  public state = initialState;

  private inputRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidCatch(error, info) {
    this.setState({ hasError: true, lastError: error });
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
  }

  private handleFilter = ev => {
    this.setState({ filter: ev.target.value });
    this.props.setTitleFilter(ev.target.value);
  }

  private filterBlur = () => {
    if (this.state.filterShown && this.state.filter === '') {
      this.setState({ filterShown: false });
    }
  }

  public render() {
    if (!this.state.hasError) {
      return (
        <>
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
          <div className={styles.progress_area}>
            <LinearProgress
              variant="determinate"
              color={'secondary'}
              value={this.props.loadingProgress}
              hidden={!this.props.showLoadingProgressBar}
            />
          </div>
          <Drawer
            className={styles.sidebar}
            variant="persistent"
            anchor="left"
            open={!this.props.paneHidden}
          >
            <div className={styles.sidebar_wrapper}>
              <div className={styles.sidebar_header}>
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
              </div>
              <div className={styles.sidebar_content}>
                <div className={classnames(styles.sidebar_component, styles.sidebar_folder)}>
                  <SummaryList />
                  <Divider />
                  <CourseList />
                  <Divider />
                  <SettingList />
                </div>
                {/* list of cards */}
                <div className={classnames(styles.sidebar_component, styles.sidebar_cards)}>
                  <CardList />
                </div>
              </div>
            </div>
          </Drawer>
          {/* detail area */}
          <div
            className={classnames(styles.pane_content, {
              [styles.pane_fullscreen]: this.props.paneHidden,
            })}
          >
            <Toolbar />
            <DetailPane />
          </div>
          {/* dialogs */}
          <LoginDialog />
          <NetworkErrorDialog />
          <NewSemesterDialog />
          <ClearDataDialog />
          <LogoutDialog />
          {/* snackbar for notification */}
          <ColoredSnackbar />
        </>
      );
    } 
      return (
        <>
          <Typography variant="h5" className={styles.app_error_text} noWrap={true}>
            哎呀，出错了！
          </Typography>
          <br />
          <Typography variant="body1" className={styles.app_error_text} noWrap={true}>
            发生了不可恢复的错误，请点击下面的按钮清除数据重新来过。
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            className={styles.app_error_text}
            onClick={this.props.resetApp}
          >
            清除数据
          </Button>
          <Typography variant="body1" className={styles.app_error_text} noWrap={true}>
            错误详细消息：{this.state.lastError.toString()}
          </Typography>
        </>
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
