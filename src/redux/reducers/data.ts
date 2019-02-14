import {
  ContentType,
  CourseContent,
  CourseInfo,
  SemesterInfo,
  SemesterType,
} from 'thu-learn-lib/lib/types';
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
import { Map } from 'immutable';

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
  for (const courseId of Object.keys(fetched)) {
    for (const c of fetched[courseId]) {
      // compare the time of two contents (including undefined)
      // if they differ, mark the content as unread
      const oldContent = oldMap.get(c.id);
      const newDate = c[dateKey[contentType]];
      let updated = true;
      if (oldContent !== undefined) {
        if (newDate === oldContent[dateKey[contentType]]) {
          updated = false;
        }
      }
      // copy other attributes either way
      const newContent: ContentInfo = {
        ...c,
        courseId,
        courseName: courseMap.get(courseId).name,
        date: newDate,
        hasRead: !updated,
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
  const oldContent = oldMap.get(id);
  oldContent[key] = status;
  return oldMap.set(id, oldContent);
}

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

    case DataActionType.UPDATE_COURSES:
      // update course list
      // any content that belongs to removed courses will be removed in following steps
      let courseMap = Map<string, CourseInfo>();
      for (const c of action.courseList) {
        courseMap = courseMap.set(c.id, c);
      }
      return {
        ...state,
        courseMap,
      };

    case DataActionType.UPDATE_CONTENT:
      return {
        ...state,
        [stateKey]: update(state[stateKey], action.contentType, action.content, state.courseMap),
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
