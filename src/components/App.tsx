import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  AppBar as MuiAppBar,
  Button,
  Toolbar,
  Divider,
  LinearProgress,
  CssBaseline,
  IconButton,
  Drawer,
  InputBase,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  useColorScheme,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { type Mode as ColorMode } from '@mui/system/cssVars/useCurrentColorScheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';

import { type AppProps } from '../types/ui';
import { IUiStateSlice, STATE_DATA, STATE_HELPER, STATE_UI } from '../redux/reducers';
import { setTitleFilter, toggleChangeSemesterDialog, togglePaneHidden } from '../redux/actions/ui';
import styles from '../css/main.module.css';

import SummaryList from './SummaryList';
import CourseList from './CourseList';
import SettingList from './SettingList';
import CardList from './CardList';
import {
  ChangeSemesterDialog,
  ClearDataDialog,
  LoginDialog,
  LogoutDialog,
  NetworkErrorDialog,
  NewSemesterDialog,
} from './dialogs';
import ColoredSnackbar from './ColoredSnackbar';
import { type UiState } from '../redux/reducers/ui';
import DetailPane from './DetailPane';
import { type DataState } from '../redux/reducers/data';
import { formatSemester } from '../utils/format';
import { type HelperState } from '../redux/reducers/helper';
import { clearAllData } from '../redux/actions/data';
import { removeStoredCredential } from '../utils/storage';
import { t } from '../utils/i18n';

const initialState = {
  filterShown: false,
  filter: '',
  hasError: false,
  lastError: new Error(),
  lastErrorInfo: undefined,
};

const AppBar = (props: { openSidebar: AppProps['openSidebar'] }) => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'colorModeMenu' });
  const { mode, setMode } = useColorScheme();
  const handleColorModeClick = (m: ColorMode) => {
    setMode(m);
    popupState.close();
  };

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          className={classnames(styles.app_bar_btn)}
          onClick={props.openSidebar}
          size="large"
        >
          <FontAwesomeIcon icon="bars" />
        </IconButton>
        <Typography component="div" sx={{ flexGrow: 1 }}></Typography>
        <div>
          <IconButton
            color="inherit"
            aria-label="Set color mode"
            size="large"
            {...bindTrigger(popupState)}
          >
            <FontAwesomeIcon icon="circle-half-stroke" />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              key="system"
              selected={mode === 'system'}
              onClick={() => handleColorModeClick('system')}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon="circle-half-stroke" />
              </ListItemIcon>
              <ListItemText>{t(`App_ColorMode_system`)}</ListItemText>
            </MenuItem>
            <MenuItem
              key="light"
              selected={mode === 'light'}
              onClick={() => handleColorModeClick('light')}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon="sun" />
              </ListItemIcon>
              <ListItemText>{t(`App_ColorMode_light`)}</ListItemText>
            </MenuItem>
            <MenuItem
              key="dark"
              selected={mode === 'dark'}
              onClick={() => handleColorModeClick('dark')}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon="moon" />
              </ListItemIcon>
              <ListItemText>{t(`App_ColorMode_dark`)}</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

class App extends React.PureComponent<AppProps, typeof initialState> {
  public state = initialState;

  private inputRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidCatch(error, info) {
    this.setState({ hasError: true, lastError: error, lastErrorInfo: info });
    console.error(error);
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

  private handleFilter = (ev) => {
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
          <AppBar openSidebar={this.props.openSidebar} />
          {/* progress bar */}
          <header className={styles.progress_area}>
            {this.props.showLoadingProgressBar ? (
              <LinearProgress
                variant="determinate"
                color="secondary"
                value={this.props.loadingProgress}
              />
            ) : null}
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
                      size="large"
                    >
                      <FontAwesomeIcon icon="angle-left" />
                    </IconButton>
                    <Typography variant="subtitle1" className={styles.sidebar_master_title} noWrap>
                      {this.props.semesterTitle}
                    </Typography>
                    {!this.props.latestSemester ? (
                      <Tooltip title={t('App_NotLearnSemester')}>
                        <IconButton
                          className={styles.sidebar_master_notify_icon}
                          onClick={this.props.openChangeSemesterDialog}
                          size="large"
                        >
                          <FontAwesomeIcon icon="star-of-life" />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </Toolbar>
                  <Toolbar
                    className={classnames(styles.sidebar_header_right, {
                      [styles.sidebar_filter_shown]: this.state.filterShown,
                    })}
                  >
                    <Typography variant="h6" className={styles.sidebar_cardlist_name} noWrap>
                      {this.props.cardListTitle}
                    </Typography>

                    <div className={styles.sidebar_filter_group}>
                      <IconButton
                        className={classnames(styles.filter_btn)}
                        onClick={this.toggleFilter}
                        size="large"
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
                          placeholder={t('App_Filter')}
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
          <ChangeSemesterDialog />
          <ClearDataDialog />
          <LogoutDialog />
          {/* snackbar for notification */}
          <ColoredSnackbar />
        </main>
      );
    }
    return (
      <main className={styles.app_error_section}>
        <Typography variant="h5" className={styles.app_error_text} noWrap>
          <b>{t('App_Error_Title')}</b>
        </Typography>
        <Typography variant="body1" className={styles.app_error_text} noWrap>
          {t('App_Error_Content')}
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          className={styles.app_error_text}
          onClick={() => {
            window.location.replace(window.location.href);
          }}
        >
          {t('App_Error_Refresh')}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          className={styles.app_error_text}
          onClick={this.props.resetApp}
        >
          {t('App_Error_ClearData')}
        </Button>
        <Typography variant="body1" className={styles.app_error_text}>
          <b>{t('App_Error_Support')}</b>
        </Typography>
        <Typography variant="body1" className={styles.app_error_text}>
          {t('App_Error_Info')}
          <br />
          <code>
            {this.state.lastError.stack ??
              `${this.state.lastError.name}: ${this.state.lastError.message}`}
          </code>
        </Typography>
        <Typography variant="body1" className={styles.app_error_text}>
          {t('App_Error_Component')}
          <code>{this.state.lastErrorInfo?.componentStack ?? t('App_Error_ComponentMissing')}</code>
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
    cardListTitle: helperState.loggedIn ? uiState.cardListTitle : t('App_Loading'),
    semesterTitle: formatSemester(dataState.semester),
    latestSemester: dataState.semester.id === dataState.fetchedSemester.id,
  };
};

const mapDispatchToProps = (dispatch): Partial<AppProps> => ({
  openSidebar: () => dispatch(togglePaneHidden(false)),
  closeSidebar: () => dispatch(togglePaneHidden(true)),
  openChangeSemesterDialog: () => dispatch(toggleChangeSemesterDialog(true)),
  setTitleFilter: (s: string) => {
    const filter = s.trim();
    dispatch(setTitleFilter(filter === '' ? undefined : filter));
  },
  resetApp: async () => {
    // clear all data
    await removeStoredCredential();
    dispatch(clearAllData());
    // refresh page
    window.location.replace(window.location.href);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
