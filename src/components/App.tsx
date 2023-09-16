import React, { useState, type ErrorInfo, useRef, useEffect } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import classnames from 'classnames';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setTitleFilter,
  toggleChangeSemesterDialog,
  togglePaneHidden,
  clearAllData,
  tryLoginSilently,
} from '../redux/actions';
import { formatSemester } from '../utils/format';
import { removeStoredCredential } from '../utils/storage';
import { interceptCsrfRequest } from '../utils/csrf';
import type { ColorMode } from '../types/ui';
import type { Language } from '../i18n';

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
import DetailPane from './DetailPane';

import styles from '../css/main.module.css';

const LanguageSwitcher = () => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'languageMenu' });
  const { i18n } = useLingui();
  const handle = (lang: Language) => {
    i18n.activate(lang);
    popupState.close();
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Set color mode"
        size="large"
        {...bindTrigger(popupState)}
      >
        <FontAwesomeIcon icon="language" />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        <MenuItem key="zh" selected={i18n.locale === 'zh'} onClick={() => handle('zh')}>
          <ListItemText>
            <Trans>中文</Trans>
          </ListItemText>
        </MenuItem>
        <MenuItem key="en" selected={i18n.locale === 'en'} onClick={() => handle('en')}>
          <ListItemText>
            <Trans>English</Trans>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const ColorModeSwitcher = () => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'colorModeMenu' });
  const { mode, setMode } = useColorScheme();
  const handle = (m: ColorMode) => {
    setMode(m);
    popupState.close();
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Set color mode"
        size="large"
        {...bindTrigger(popupState)}
      >
        <FontAwesomeIcon icon="circle-half-stroke" />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        <MenuItem key="system" selected={mode === 'system'} onClick={() => handle('system')}>
          <ListItemIcon>
            <FontAwesomeIcon icon="circle-half-stroke" />
          </ListItemIcon>
          <ListItemText>
            <Trans>跟随系统</Trans>
          </ListItemText>
        </MenuItem>
        <MenuItem key="light" selected={mode === 'light'} onClick={() => handle('light')}>
          <ListItemIcon>
            <FontAwesomeIcon icon="sun" />
          </ListItemIcon>
          <ListItemText>
            <Trans>亮</Trans>
          </ListItemText>
        </MenuItem>
        <MenuItem key="dark" selected={mode === 'dark'} onClick={() => handle('dark')}>
          <ListItemIcon>
            <FontAwesomeIcon icon="moon" />
          </ListItemIcon>
          <ListItemText>
            <Trans>暗</Trans>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const AppBar = () => {
  const dispatch = useAppDispatch();

  const openSidebar = () => dispatch(togglePaneHidden(false));

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          className={classnames(styles.app_bar_btn)}
          onClick={openSidebar}
          size="large"
        >
          <FontAwesomeIcon icon="bars" />
        </IconButton>
        <Typography component="div" sx={{ flexGrow: 1 }}></Typography>
        <LanguageSwitcher />
        <ColorModeSwitcher />
      </Toolbar>
    </MuiAppBar>
  );
};

const AppDrawer = () => {
  const dispatch = useAppDispatch();

  const paneHidden = useAppSelector((state) => state.ui.paneHidden);
  const cardListTitle = useAppSelector((state) =>
    state.helper.loggedIn ? state.ui.cardListTitle : t`加载中...`,
  );
  const semesterTitle = useAppSelector((state) => formatSemester(state.data.semester));
  const isLatestSemester = useAppSelector(
    (state) => state.data.semester.id === state.data.fetchedSemester.id,
  );

  const inputRef = useRef<HTMLInputElement>();
  const [filterShown, setFilterShown] = useState(false);
  const [filter, setFilter] = useState('');

  const toggleFilter = () => {
    if (filterShown) {
      setFilterShown(false);
      setFilter('');
      dispatch(setTitleFilter(undefined));
    } else {
      setTimeout(() => inputRef.current?.focus(), 250);
      setFilterShown(true);
    }
  };

  return (
    <Drawer className={styles.sidebar} variant="persistent" anchor="left" open={!paneHidden}>
      <nav className={styles.sidebar_wrapper}>
        <header className={styles.sidebar_header}>
          <div className={styles.sidebar_header_content}>
            <Toolbar className={styles.sidebar_header_left}>
              <IconButton
                className={classnames(styles.app_bar_btn)}
                onClick={() => dispatch(togglePaneHidden(true))}
                size="large"
              >
                <FontAwesomeIcon icon="angle-left" />
              </IconButton>
              <Typography variant="subtitle1" className={styles.sidebar_master_title} noWrap>
                {semesterTitle}
              </Typography>
              {!isLatestSemester && (
                <Tooltip title={t`非网络学堂当前学期`}>
                  <IconButton
                    className={styles.sidebar_master_notify_icon}
                    onClick={() => dispatch(toggleChangeSemesterDialog(true))}
                    size="large"
                  >
                    <FontAwesomeIcon icon="star-of-life" />
                  </IconButton>
                </Tooltip>
              )}
            </Toolbar>
            <Toolbar
              className={classnames(styles.sidebar_header_right, {
                [styles.sidebar_filter_shown]: filterShown,
              })}
            >
              <Typography variant="h6" className={styles.sidebar_cardlist_name} noWrap>
                {cardListTitle}
              </Typography>

              <div className={styles.sidebar_filter_group}>
                <IconButton
                  className={classnames(styles.filter_btn)}
                  onClick={toggleFilter}
                  size="large"
                >
                  <FontAwesomeIcon
                    icon="filter"
                    className={classnames(styles.filter_icon, {
                      [styles.filter_icon_shown]: !filterShown,
                    })}
                  />
                  <FontAwesomeIcon
                    icon="times"
                    className={classnames(styles.filter_icon, {
                      [styles.filter_icon_shown]: filterShown,
                    })}
                  />
                </IconButton>
                <div className={styles.filter_input}>
                  <InputBase
                    inputRef={inputRef}
                    className={styles.filter_input_inner}
                    placeholder={t`筛选`}
                    value={filter}
                    onChange={(ev) => {
                      setFilter(ev.target.value);
                      dispatch(setTitleFilter(ev.target.value.trim() || undefined));
                    }}
                    inputProps={{
                      onBlur: () => {
                        if (!filterShown && filter === '') setFilterShown(false);
                      },
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
  );
};

const Fallback = ({ error, errorInfo }: FallbackProps & { errorInfo: ErrorInfo | null }) => {
  const dispatch = useAppDispatch();

  const resetApp = async () => {
    // clear all data
    await removeStoredCredential();
    dispatch(clearAllData());
    // refresh page
    window.location.replace(window.location.href);
  };

  return (
    <main className={styles.app_error_section}>
      <Typography variant="h5" className={styles.app_error_text} noWrap>
        <b>
          <Trans>哎呀，出错了！</Trans>
        </b>
      </Typography>
      <Typography variant="body1" className={styles.app_error_text} noWrap>
        <Trans>发生了不可恢复的错误，请尝试刷新页面。如果错误继续出现，请清除数据重新来过。</Trans>
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        className={styles.app_error_text}
        onClick={() => {
          window.location.replace(window.location.href);
        }}
      >
        <Trans>刷新</Trans>
      </Button>
      <Button
        color="secondary"
        variant="contained"
        className={styles.app_error_text}
        onClick={resetApp}
      >
        <Trans>清除数据</Trans>
      </Button>
      <Typography variant="body1" className={styles.app_error_text}>
        <b>
          <Trans>请将下面的错误信息发送给开发者，以协助解决问题，感谢支持！</Trans>
        </b>
      </Typography>
      <Typography variant="body1" className={styles.app_error_text}>
        <Trans>错误信息：</Trans>
        <br />
        <code>{error.stack ?? `${error.name}: ${error.message}`}</code>
      </Typography>
      <Typography variant="body1" className={styles.app_error_text}>
        <Trans>错误组件：</Trans>
        <code>{errorInfo?.componentStack ?? <Trans>无此信息</Trans>}</code>
      </Typography>
    </main>
  );
};

const App = () => {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  const dispatch = useAppDispatch();

  const loadingProgress = useAppSelector((state) => state.ui.loadingProgress);
  const paneHidden = useAppSelector((state) => state.ui.paneHidden);
  const csrf = useAppSelector((state) => state.helper.helper.getCSRFToken());

  useEffect(() => {
    // keep login state
    const handle = window.setInterval(() => dispatch(tryLoginSilently()), 14 * 60 * 1000); // < 15 minutes and as long as possible
    return () => window.clearInterval(handle);
  }, []);

  useEffect(() => interceptCsrfRequest(csrf), [csrf]);

  return (
    <ErrorBoundary
      onError={(error, info) => {
        setErrorInfo(info);
        console.error(error);
      }}
      fallbackRender={(fallbackProps) => <Fallback {...fallbackProps} errorInfo={errorInfo} />}
    >
      <main>
        <CssBaseline />
        {/* sidebar */}
        <AppBar />
        {/* progress bar */}
        <header className={styles.progress_area}>
          {loadingProgress !== undefined && (
            <LinearProgress variant="determinate" color="secondary" value={loadingProgress} />
          )}
        </header>
        <AppDrawer />
        {/* detail area */}
        <aside
          className={classnames(styles.pane_content, {
            [styles.pane_fullscreen]: paneHidden,
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
      </main>
    </ErrorBoundary>
  );
};

export default App;
