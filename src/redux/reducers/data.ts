import {
  ContentType,
  CourseContent,
  CourseInfo,
  SemesterInfo,
  SemesterType,
} from 'thu-learn-lib/lib/types';
import { Map } from 'immutable';
import orderBy from 'lodash/orderBy';

import {
  ContentInfo,
  DiscussionInfo,
  FileInfo,
  HomeworkInfo,
  NotificationInfo,
  QuestionInfo,
} from '../../types/data';
import { DataAction } from '../actions/data';
import { DataActionType } from '../actions/actionTypes';

interface IDataState {
  semester: SemesterInfo;
  fetchedSemester: SemesterInfo;
  insistSemester: boolean;
  courseMap: Map<string, CourseInfo>;
  notificationMap: Map<string, NotificationInfo>;
  fileMap: Map<string, FileInfo>;
  homeworkMap: Map<string, HomeworkInfo>;
  discussionMap: Map<string, DiscussionInfo>;
  questionMap: Map<string, QuestionInfo>;
  lastUpdateTime: Date;
  updateFinished: boolean;
  contentIgnore: {
    [courseId: string]: {
      [type: string]: boolean;
    };
  };
}

export type DataState = IDataState;

const semesterPlaceholder: SemesterInfo = {
  id: '',
  startDate: new Date(),
  endDate: new Date(),
  startYear: 0,
  endYear: 0,
  type: SemesterType.UNKNOWN,
};

const initialState: IDataState = {
  semester: semesterPlaceholder,
  fetchedSemester: semesterPlaceholder,
  insistSemester: false,
  courseMap: Map(),
  notificationMap: Map(),
  fileMap: Map(),
  homeworkMap: Map(),
  discussionMap: Map(),
  questionMap: Map(),
  lastUpdateTime: new Date(0),
  updateFinished: false,
  contentIgnore: {},
};

function update<T extends ContentInfo>(
  oldMap: Map<string, T>,
  contentType: ContentType,
  fetched: CourseContent,
  courseMap: Map<string, CourseInfo>,
): Map<string, T> {
  let result = Map<string, ContentInfo>();

  const dateKey = {
    [ContentType.NOTIFICATION]: 'publishTime',
    [ContentType.FILE]: 'uploadTime',
    [ContentType.HOMEWORK]: 'deadline',
    [ContentType.DISCUSSION]: 'publishTime',
    [ContentType.QUESTION]: 'publishTime',
  };

  // we always use the fetched data
  for (const [courseId, content] of Object.entries(fetched)) {
    for (const c of content) {
      // compare the time of two contents (including undefined)
      // if they differ, mark the content as unread
      const oldContent = oldMap.get(c.id);
      const newDate = c[dateKey[contentType]];
      let updated = true;
      if (oldContent !== undefined) {
        if (newDate.getTime() === oldContent[dateKey[contentType]].getTime()) {
          updated = false;
        }
      }
      // copy other attributes either way
      const newContent: ContentInfo = {
        ...c,
        courseId,
        type: contentType,
        courseName: courseMap.get(courseId).name,
        date: newDate,
        hasRead: oldContent === undefined ? false : !updated && oldContent.hasRead,
        starred: oldContent === undefined ? false : oldContent.starred,
      };
      result = result.set(c.id, newContent);
    }
  }

  // the upcast is necessary
  return result as Map<string, T>;
}

function toggle<T extends ContentInfo>(
  oldMap: Map<string, T>,
  id: string,
  key: string,
  status: boolean,
): Map<string, T> {
  return oldMap.update(id, c => {
    return {
      ...c,
      [key]: status,
    };
  });
}

function markAllRead<T extends ContentInfo>(oldMap: Map<string, T>): Map<string, T> {
  let map = oldMap;
  for (const k of oldMap.keys()) {
    map = map.update(k, c => {
      return {
        ...c,
        hasRead: true,
      };
    });
  }
  return map;
}

const IGNORE_UNSET_ALL = {
  [ContentType.NOTIFICATION]: false,
  [ContentType.FILE]: false,
  [ContentType.HOMEWORK]: false,
  [ContentType.QUESTION]: false,
  [ContentType.QUESTION]: false,
};

export default function data(state: IDataState = initialState, action: DataAction): IDataState {
  const stateKey = `${action.contentType}Map`;

  switch (action.type) {
    case DataActionType.NEW_SEMESTER:
      // save the new semester for querying user
      return {
        ...state,
        fetchedSemester: action.semester,
      };

    case DataActionType.INSIST_SEMESTER:
      return {
        ...state,
        insistSemester: action.insist,
      };

    case DataActionType.UPDATE_SEMESTER:
      // switch to new semester, remove all content
      return {
        ...initialState,
        semester: action.semester,
      };

    case DataActionType.UPDATE_COURSES: {
      // update course list and ignoring list
      // any content that belongs to removed courses will be removed in following steps
      let courseMap = Map<string, CourseInfo>();
      const contentIgnore = state.contentIgnore;
      for (const c of orderBy(action.courseList, ['id'])) {
        courseMap = courseMap.set(c.id, c);
        if (contentIgnore[c.id] === undefined) {
          contentIgnore[c.id] = {
            ...IGNORE_UNSET_ALL,
          };
        }
      }
      // remove courses that do not exist any more
      // otherwise the app will crash after dropping any course
      for (const k of [...Object.keys(contentIgnore)]) {
        if (!courseMap.has(k)) {
          delete contentIgnore[k];
        }
      }
      return {
        ...state,
        contentIgnore,
        courseMap,
      };
    }

    case DataActionType.UPDATE_CONTENT:
      return {
        ...state,
        [stateKey]: update(state[stateKey], action.contentType, action.content, state.courseMap),
        lastUpdateTime: new Date(),
        updateFinished: false,
      };

    case DataActionType.UPDATE_FINISHED:
      return {
        ...state,
        updateFinished: true,
      };

    case DataActionType.TOGGLE_CONTENT_IGNORE:
      return {
        ...state,
        contentIgnore: {
          ...state.contentIgnore,
          [action.id]: {
            ...state.contentIgnore[action.id],
            [action.contentType]: action.state,
          },
        },
        updateFinished: false,
      };

    case DataActionType.RESET_CONTENT_IGNORE: {
      const contentIgnore = {};
      for (const c of [...state.courseMap.keys()].sort()) {
        contentIgnore[c] = {
          ...IGNORE_UNSET_ALL,
        };
      }
      return {
        ...state,
        contentIgnore,
        updateFinished: false,
      };
    }

    case DataActionType.MARK_ALL_READ:
      return {
        ...state,
        notificationMap: markAllRead(state.notificationMap),
        fileMap: markAllRead(state.fileMap),
        homeworkMap: markAllRead(state.homeworkMap),
        discussionMap: markAllRead(state.discussionMap),
        questionMap: markAllRead(state.questionMap),
      };

    case DataActionType.TOGGLE_READ_STATE:
      return {
        ...state,
        [stateKey]: toggle(state[stateKey], action.id, 'hasRead', action.state),
      };

    case DataActionType.TOGGLE_STAR_STATE:
      return {
        ...state,
        [stateKey]: toggle(state[stateKey], action.id, 'starred', action.state),
      };

    case DataActionType.CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
}
