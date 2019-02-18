import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Drawer from '@material-ui/core/Drawer';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppProps } from '../types/ui';
import { IUiStateSlice, STATE_UI } from '../redux/reducers';
import { togglePane } from '../redux/actions/ui';
import styles from '../css/main.css';

import { withStyles } from '@material-ui/styles';

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

class App extends React.PureComponent<AppProps, never> {
  state = {
    filterShown: false,
    filter: '',
  }

  componentWillMount() {
    this.inputRef = React.createRef();
  }

  toggleFilter = () => {
    if(this.state.filterShown) {
      this.setState({
        filterShown: false,
      });
    } else {
      setTimeout(() => this.inputRef.current.focus(), 250);

      this.setState({
        filterShown: true,
        filter: '',
      });
    }
  }

  handleFilter = ev => {
    this.setState({ filter: ev.target.value });
  }

  filterBlur = () => {
    if(this.state.filterShown && this.state.filter === '') {
      this.setState({ filterShown: false });
    }
  }

  public render() {
    return (
      <>
        <CssBaseline />
        {/* sidebar */}
        <AppBar
          position="fixed"
          className={classnames(
            styles.app_bar,
            { [styles.app_bar_open]: !this.props.paneHidden },
          )}
        >
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
        <Drawer
          className={styles.sidebar}
          variant="persistent"
          anchor="left"
          open={!this.props.paneHidden}
          classes={{
            paper: styles.sidebar_paper,
          }}
        >
          <div className={styles.sidebar_wrapper}>
            <div
              className={styles.sidebar_header}
            >
              <div className={styles.sidebar_header_content}>
                <Toolbar className={styles.sidebar_header_left}>
                  <IconButton
                    className={classnames(styles.app_bar_btn)}
                    onClick={this.props.closeSidebar}
                  >
                    <FontAwesomeIcon icon="angle-left" />
                  </IconButton>
                </Toolbar>
                <Toolbar className={classnames(styles.sidebar_header_right, { [styles.sidebar_filter_shown]: this.state.filterShown })}>
                  <Typography variant="h6" className={styles.sidebar_cardlist_name} noWrap>
                    标题在这里
                  </Typography>

                  <div className={styles.sidebar_filter_group}>
                    <IconButton
                      className={classnames(styles.filter_btn)}
                      onClick={this.toggleFilter}
                    >
                      <FontAwesomeIcon
                        icon="filter"
                        className={classnames(styles.filter_icon, { [styles.filter_icon_shown]: !this.state.filterShown })}
                      />
                      <FontAwesomeIcon
                        icon="times"
                        className={classnames(styles.filter_icon, { [styles.filter_icon_shown]: this.state.filterShown })}
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
                          onBlur: this.filterBlur
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
          <Toolbar></Toolbar>
          <DetailPane />
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
      </>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<AppProps> => {
  const uiState = state[STATE_UI] as UiState;
  return {
    showLoadingProgressBar: uiState.showLoadingProgressBar,
    loadingProgress: uiState.loadingProgress,
    paneHidden: uiState.paneHidden,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): Partial<AppProps> => ({
  openSidebar: () => dispatch(togglePane(false)),
  closeSidebar: () => dispatch(togglePane(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
