import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Toolbar,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import classnames from 'classnames';
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { type ErrorInfo, StrictMode, useEffect, useRef, useState } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Route, Switch, useLocation } from 'wouter';

import IconAngleLeft from '~icons/fa6-solid/angle-left';
import IconBars from '~icons/fa6-solid/bars';
import IconCircleHalfStroke from '~icons/fa6-solid/circle-half-stroke';
import IconFilter from '~icons/fa6-solid/filter';
import IconLanguage from '~icons/fa6-solid/language';
import IconMoon from '~icons/fa6-solid/moon';
import IconStarOfLife from '~icons/fa6-solid/star-of-life';
import IconSun from '~icons/fa6-solid/sun';
import IconXmark from '~icons/fa6-solid/xmark';
import CardList from '../components/CardList';
import CourseList from '../components/CourseList';
import {
  ChangeSemesterDialog,
  ClearDataDialog,
  LoginDialog,
  LogoutDialog,
  NewSemesterDialog,
} from '../components/dialogs';
import SettingList from '../components/SettingList';
import SummaryList from '../components/SummaryList';
import styles from '../css/main.module.css';
import type { Language } from '../i18n';
import {
  loadApp,
  resetApp,
  setTitleFilter,
  syncLanguage,
  toggleChangeSemesterDialog,
  togglePaneHidden,
  tryLoginSilently,
} from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCardListTitle } from '../redux/selectors';
import type { ColorMode } from '../types/ui';
import { interceptCsrfRequest } from '../utils/csrf';
import { formatSemester } from '../utils/format';
import Content from './content';
import Doc from './doc/_doc';
import ContentIgnoreSetting from './settings';
import Web from './web';
import Welcome from './welcome';

const LanguageSwitcher = () => {
  const { i18n } = useLingui();
  const dispatch = useAppDispatch();

  const popupState = usePopupState({ variant: 'popover', popupId: 'languageMenu' });
  const handle = (lang: Language) => {
    i18n.activate(lang);
    dispatch(syncLanguage());
    popupState.close();
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Set language"
        size="large"
        {...bindTrigger(popupState)}
      >
        <IconLanguage />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        <MenuItem key="zh" selected={i18n.locale === 'zh'} onClick={() => handle('zh')}>
          <ListItemText>中文</ListItemText>
        </MenuItem>
        <MenuItem key="en" selected={i18n.locale === 'en'} onClick={() => handle('en')}>
          <ListItemText>English</ListItemText>
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
        <IconCircleHalfStroke />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        <MenuItem key="system" selected={mode === 'system'} onClick={() => handle('system')}>
          <ListItemIcon>
            <IconCircleHalfStroke />
          </ListItemIcon>
          <ListItemText>
            <Trans>跟随系统</Trans>
          </ListItemText>
        </MenuItem>
        <MenuItem key="light" selected={mode === 'light'} onClick={() => handle('light')}>
          <ListItemIcon>
            <IconSun />
          </ListItemIcon>
          <ListItemText>
            <Trans>亮</Trans>
          </ListItemText>
        </MenuItem>
        <MenuItem key="dark" selected={mode === 'dark'} onClick={() => handle('dark')}>
          <ListItemIcon>
            <IconMoon />
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
          <IconBars />
        </IconButton>
        <Typography component="div" sx={{ flexGrow: 1 }} />
        <LanguageSwitcher />
        <ColorModeSwitcher />
      </Toolbar>
    </MuiAppBar>
  );
};

const AppDrawer = () => {
  const { _ } = useLingui();
  const dispatch = useAppDispatch();

  const paneHidden = useAppSelector((state) => state.ui.paneHidden);
  const cardListTitle = useAppSelector(selectCardListTitle);
  const semesterTitle = useAppSelector((state) => formatSemester(state.data.semester));
  const isLatestSemester = useAppSelector(
    (state) => state.data.semester.id === state.data.fetchedSemester.id,
  );

  const inputRef = useRef<HTMLInputElement>(null);
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
                <IconAngleLeft />
              </IconButton>
              <Typography variant="subtitle1" className={styles.sidebar_master_title} noWrap>
                {semesterTitle}
              </Typography>
              {!isLatestSemester && (
                <Tooltip title={t`非网络学堂当前学期`}>
                  <IconButton
                    className={styles.sidebar_master_notify_icon}
                    onClick={() => dispatch(toggleChangeSemesterDialog(true))}
                    size="small"
                  >
                    <IconStarOfLife />
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
                {cardListTitle.map((part) => _(part)).join('-')}
              </Typography>

              <div className={styles.sidebar_filter_group}>
                <IconButton
                  className={classnames(styles.filter_btn)}
                  onClick={toggleFilter}
                  size="large"
                >
                  {filterShown ? <IconXmark /> : <IconFilter />}
                </IconButton>
                {filterShown && (
                  <div>
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
                )}
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
        onClick={() => dispatch(resetApp(true))}
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

  const [_, navigate] = useLocation();

  useEffect(() => {
    dispatch(loadApp()).then((res) => {
      if (res.navigate) {
        navigate(`/doc/${res.navigate}`);
      }
    });
    // keep login state
    const handle = window.setInterval(() => dispatch(tryLoginSilently()), 14 * 60 * 1000); // < 15 minutes and as long as possible
    return () => window.clearInterval(handle);
  }, [dispatch, navigate]);

  useEffect(() => {
    interceptCsrfRequest(csrf);
  }, [csrf]);

  return (
    <ErrorBoundary
      onError={(error, info) => {
        setErrorInfo(info);
        console.error(error);
      }}
      fallbackRender={(fallbackProps) => <Fallback {...fallbackProps} errorInfo={errorInfo} />}
    >
      <StrictMode>
        <main>
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
            <Switch>
              <Route path="/" component={Welcome} />
              <Route path="/settings" component={ContentIgnoreSetting} />
              <Route path="/web/:url" component={Web} />
              <Route path="/content/:type/:id" component={Content} />
              <Route path="/doc" nest component={Doc} />
            </Switch>
          </aside>
          {/* dialogs */}
          <LoginDialog />
          <NewSemesterDialog />
          <ChangeSemesterDialog />
          <ClearDataDialog />
          <LogoutDialog />
        </main>
      </StrictMode>
    </ErrorBoundary>
  );
};

export default App;
