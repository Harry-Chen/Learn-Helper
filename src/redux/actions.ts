import type { ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { i18n, storage } from 'webextension-polyfill';
import { compare as compareVersion } from 'compare-versions';
import { ContentType, Language, type ApiError, CourseType, SemesterType } from 'thu-learn-lib';

import type { ContentInfo, FileInfo } from '../types/data';
import { initiateFileDownload } from '../utils/download';
import { failReasonToString } from '../utils/format';
import { t } from '../utils/i18n';
import { getStoredCredential, storeCredential } from '../utils/storage';
import { STORAGE_KEY_REDUX, STORAGE_KEY_REDUX_LEGACY, STORAGE_KEY_VERSION } from '../constants';
import { version as currentVersion } from '../../package.json';

import { dataSlice } from './reducers/data';
import { helperSlice } from './reducers/helper';
import { uiSlice } from './reducers/ui';
import type { RootState } from './store';
import { selectContentIgnore, selectDataLists } from './selectors';
import { enqueueSnackbar } from 'notistack';

export const {
  newSemester,
  insistSemester,
  updateSemesterList,
  updateSemester,
  syncSemester,
  updateCourses,
  updateNotification,
  updateFile,
  updateHomework,
  updateDiscussion,
  updateQuestion,
  updateFinished,
  toggleReadState,
  toggleStarState,
  toggleIgnoreState,
  toggleContentIgnore,
  resetContentIgnore,
  markAllRead,
  clearAllData,
  clearFetchedData,
  loadData,
} = dataSlice.actions;
export const { loggedIn, loggedOut } = helperSlice.actions;
export const {
  setLoadingProgress,
  togglePaneHidden,
  toggleLoginDialog,
  toggleLoginDialogProgress,
  loginEnd,
  toggleNetworkErrorDialog,
  toggleNewSemesterDialog,
  toggleIgnoreWrongSemester,
  toggleLogoutDialog,
  toggleClearDataDialog,
  toggleChangeSemesterDialog,
  resetCardVisibilityThreshold,
  loadMoreCard,
  setCardListTitle,
  setCardList,
  setCardFilter,
  setDetailUrl,
  setDetailContent,
  setDetailPage,
  setTitleFilter,
} = uiSlice.actions;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

// here we don't catch errors in login(), for there are two cases:
// 1. silent login when starting, then NetworkErrorDialog should be shown
// 2. explicit login in LoginDialog, then login dialog should still be shown
export const login =
  (username: string, password: string, save: boolean): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    dispatch(toggleLoginDialogProgress(true));
    const helperState = getState().helper;
    const helper = helperState.helper;

    // wait at most 5 seconds for timeout
    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject({ reason: 'TIMEOUT' });
      }, 5000);
    });

    try {
      await Promise.race([helper.login(username, password), timeout]);
    } catch (e) {
      const error = e as ApiError;
      enqueueSnackbar(
        t('Snackbar_LoginFailed', [
          (failReasonToString(error?.reason) ?? error).toString() ?? t('Snackbar_UnknownError'),
        ]),
        { variant: 'error' },
      );
      dispatch(loginEnd());
      return Promise.reject(`login failed: ${error}`);
    }

    // login succeeded
    // hide login dialog (if shown), show success notice
    enqueueSnackbar(t('Snackbar_LoginSuccess'), { variant: 'success' });
    // save salted user credential if asked
    if (save) {
      await storeCredential(username, password);
    }
    dispatch(loggedIn());
    dispatch(loginEnd());
    // try to sync language with Web Learning
    try {
      const langMap = {
        'zh-CN': Language.ZH,
        'en-US': Language.EN,
      };
      const lang = langMap[i18n.getUILanguage()];
      if (lang) {
        await helper.setLanguage(lang);
      }
    } catch (e) {
      const error = e as ApiError;
      enqueueSnackbar(
        t('Snackbar_SetLangFailed', [
          (failReasonToString(error?.reason) ?? error).toString() ?? t('Snackbar_UnknownError'),
        ]),
        { variant: 'error' },
      );
    }
    return Promise.resolve();
  };

export const refreshIfNeeded = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const data = getState().data;
  const justUpdated = new Date().getTime() - data.lastUpdateTime.getTime() <= 15 * 60 * 1000;
  if (data.updateFinished && justUpdated) {
    enqueueSnackbar(t('Snackbar_NotRefreshed'), { variant: 'info' });
  } else {
    await dispatch(refresh());
  }
};

export const refresh = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  dispatch(setLoadingProgress(0));
  const helperState = getState().helper;
  const helper = helperState.helper;

  let allCourseIds: string[] = [];

  const progresses = [0, 10, 20, 38, 52, 68, 84, 100];
  const nextProgress = () => {
    const uiState = getState().ui;
    const currentProgress = uiState.loadingProgress!;
    const index = progresses.indexOf(currentProgress);
    let nextProgress = 100;
    if (index >= 0 && index < progresses.length) {
      nextProgress = progresses[index + 1];
    } else {
      console.warn(`Next progress not found, current ${currentProgress}`, progresses);
    }
    dispatch(setLoadingProgress(nextProgress));
  };

  try {
    // login on every refresh (if stored)
    const credential = await getStoredCredential();
    credential && (await helper.login(credential.username, credential.password));
    dispatch(loggedIn());

    const semesters = await helper.getSemesterIdList();
    dispatch(updateSemesterList(semesters));

    const s = await helper.getCurrentSemester();
    dispatch(newSemester(s));

    // user required to ignore semester problem
    const data = getState().data;
    const ui = getState().ui;
    const ignoreSemester = data.insistSemester || ui.ignoreWrongSemester;

    if (data.semester.type === SemesterType.UNKNOWN) {
      // no semester info yet
      dispatch(updateSemester(s));
    } else if (s.id !== data.semester.id && !ignoreSemester) {
      // stored semester differ with fetched one
      dispatch(toggleNewSemesterDialog(true));
      return;
    }

    nextProgress();

    // get the latest semester id, since it can either be changed or not
    const currentSemesterId = getState().data.semester.id;
    // get all courses
    const courses = await helper.getCourseList(currentSemesterId);
    allCourseIds = courses.map((c) => c.id);
    dispatch(updateCourses(courses));
    nextProgress();
  } catch (e) {
    console.error(e);
    dispatch(setLoadingProgress());
    dispatch(toggleNetworkErrorDialog(true));
    return;
  }

  // send all requests in parallel
  const fetchAll = [
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.NOTIFICATION,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateNotification(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.HOMEWORK,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateHomework(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.FILE,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateFile(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.DISCUSSION,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateDiscussion(res));
      nextProgress();
    },
    async () => {
      const res = await helper.getAllContents(
        allCourseIds,
        ContentType.QUESTION,
        CourseType.STUDENT,
        true,
      );
      dispatch(updateQuestion(res));
      nextProgress();
    },
  ];

  // check results
  const failures = (await Promise.allSettled(fetchAll.map((f) => f()))).filter(
    (p) => p.status == 'rejected',
  );
  const allSuccess = failures.length == 0;
  if (allSuccess) {
    enqueueSnackbar(t('Snackbar_UpdateSuccess'), { variant: 'success' });
  } else {
    enqueueSnackbar(t('Snackbar_UpdatePartialSuccess'), { variant: 'warning' });
    console.warn('Failures occurred in fetching data', failures);
  }

  // finish refreshing
  dispatch(updateFinished());
  dispatch(refreshCardList());

  // wait some time before hiding progress bar
  new Promise<void>((resolve) => {
    setTimeout(() => {
      dispatch(setLoadingProgress());
      resolve();
    }, 1000);
  });
};

const compareBoolean = (a: boolean, b: boolean) => {
  if (a === b) return 0;
  if (a) return -1;
  if (b) return 1;
};

export const refreshCardList = (): AppThunk<void> => (dispatch, getState) => {
  const state = getState();
  const data = selectDataLists(state);
  const contentIgnore = selectContentIgnore(state);
  const { type, courseId } = state.ui.cardFilter;

  let contents: ContentInfo[];
  if (type) {
    contents = data[`${type}List`].slice(0);
  } else {
    contents = ([] as ContentInfo[]).concat(
      data.notificationList,
      data.fileList,
      data.homeworkList,
      data.discussionList,
      data.questionList,
    );
  }

  dispatch(
    setCardList(
      contents
        .filter((c) =>
          type === null
            ? c.ignored
            : courseId
            ? c.courseId === courseId
            : !contentIgnore[c.courseId]?.[c.type] && !c.ignored,
        )
        .sort((a, b) => {
          const aNotDue =
            a.type === ContentType.HOMEWORK && a.date.getTime() > new Date().getTime();
          const bNotDue =
            b.type === ContentType.HOMEWORK && b.date.getTime() > new Date().getTime();
          return (
            compareBoolean(a.starred, b.starred) ||
            compareBoolean(!a.hasRead, !b.hasRead) ||
            compareBoolean(aNotDue, bNotDue) ||
            (a.date.getTime() - b.date.getTime()) * (aNotDue && bNotDue ? 1 : -1)
          );
        })
        .map(({ type, id }) => ({ type, id })),
    ),
  );
  dispatch(resetCardVisibilityThreshold());
};

export const downloadAllUnreadFiles =
  (contents: ContentInfo[]): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const helper = getState().helper.helper;
    try {
      await helper.getSemesterIdList();
    } catch (e) {
      enqueueSnackbar(t('Snackbar_Expired'), { variant: 'error' });
      return;
    }
    for (const c of contents) {
      if (c.type === ContentType.FILE && !c.hasRead) {
        const file = c as FileInfo;
        initiateFileDownload(file.downloadUrl);
        dispatch(toggleReadState({ id: file.id, type: ContentType.FILE, state: true }));
      }
    }
  };

export const loadApp = (): AppThunk<Promise<void>> => async (dispatch) => {
  const { [STORAGE_KEY_VERSION]: oldVersion, [STORAGE_KEY_REDUX]: oldData } =
    await storage.local.get([STORAGE_KEY_VERSION, STORAGE_KEY_REDUX]);

  if (oldVersion === undefined) {
    // migrate from version < 4.0.0 or newly installed, clearing all data
    console.info('Migrating from legacy version, all data cleaned');
    await storage.local.clear();
    await storage.local.set({
      [STORAGE_KEY_VERSION]: currentVersion,
    });
    dispatch(setDetailPage('readme'));
    enqueueSnackbar(t('Migration_AllDataCleared'), { variant: 'warning' });
  } else if (oldVersion !== currentVersion) {
    // for future migration
    dispatch(setDetailPage('changelog'));
    // set stored version to current one
    console.info(`Migrating from version ${oldVersion} to ${currentVersion}`);
    await storage.local.set({
      [STORAGE_KEY_VERSION]: currentVersion,
    });

    // migrate from < 4.5, clearing all data except credential & config
    if (compareVersion(oldVersion, '4.5.0', '<')) {
      dispatch(clearFetchedData());
      enqueueSnackbar(t('Migration_FetchedDataCleared'), { variant: 'warning' });
    } else {
      try {
        if (compareVersion(oldVersion, '4.6.0', '<')) {
          dispatch(
            loadData(
              JSON.parse(
                JSON.parse(
                  JSON.parse(
                    (await storage.local.get([STORAGE_KEY_REDUX_LEGACY]))[STORAGE_KEY_REDUX_LEGACY],
                  ).data,
                ),
                (key, value) => {
                  if (typeof value === 'object' && '$jsan' in value) {
                    // parse jsan
                    // from https://github.com/kolodny/jsan/blob/7216568a9a7969dfa81b834236595e862fdde984/lib/utils.js#L23C48-L23C48
                    const type = value['$jsan'][0];
                    const rest = value['$jsan'].slice(1);
                    if (type === 'd') return new Date(+rest);
                    if (type === 'u') return undefined;
                    // other types is not needed;
                  }
                  if (key.endsWith('Map')) return value.data;
                  return value;
                },
              ),
            ),
          );
        }
        enqueueSnackbar(t('Migration_Migrated'), { variant: 'info' });
      } catch (e) {
        await storage.local.clear();
        enqueueSnackbar(t('Migration_MigrateFailed'), { variant: 'error' });
      }
    }
  } else {
    console.info('Migration not necessary.');

    if (oldData !== undefined) {
      try {
        dispatch(
          loadData(
            JSON.parse(oldData, (key, value) => {
              if (
                key === 'date' ||
                key === 'deadline' ||
                key.endsWith('Date') ||
                key.endsWith('Time')
              )
                return new Date(value);
              return value;
            }),
          ),
        );
      } catch (e) {
        await storage.local.remove(STORAGE_KEY_REDUX);
        enqueueSnackbar(t('Migration_LoadFailed'), { variant: 'error' });
      }
    }
  }

  dispatch(refreshCardList());
  dispatch(tryLoginSilently());
};

export const tryLoginSilently = (): AppThunk<Promise<void>> => async (dispatch) => {
  const credential = await getStoredCredential();
  if (!credential) {
    dispatch(toggleLoginDialog(true));
    return;
  }
  try {
    await dispatch(login(credential.username, credential.password, false));
    await dispatch(refreshIfNeeded());
  } catch (e) {
    // here we catch only login problems
    // for refresh() has a try-catch block in itself
    dispatch(toggleNetworkErrorDialog(true));
  }
};
