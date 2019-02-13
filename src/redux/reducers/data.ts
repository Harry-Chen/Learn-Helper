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

interface IDataState {
  semester: SemesterInfo;
  fetchedSemester: SemesterInfo;
  courseMap: Map<string, CourseInfo>;
  notificationList: Map<string, NotificationInfo>;
  fileList: Map<string, FileInfo>;
  homeworkList: Map<string, HomeworkInfo>;
  discussionList: Map<string, DiscussionInfo>;
  questionList: Map<string, QuestionInfo>;
}

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
  courseMap: new Map(),
  notificationList: new Map(),
  fileList: new Map(),
  homeworkList: new Map(),
  discussionList: new Map(),
  questionList: new Map(),
};

function update <T extends ContentInfo>(oldMap: Map<string, T>, contentType: ContentType,
                                        fetched: CourseContent, courseMap: Map<string, CourseInfo>):
  Map<string, T> {

  const result = new Map<string, ContentInfo>();

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
      result.set(c.id, newContent);
    }
  }

  // the upcast is necessary
  return result as Map<string, T>;

}

function toggle <T extends ContentInfo>(oldMap: Map<string, T>,
                                        id: string, key: string, status: boolean): Map<string, T> {
  const oldContent = oldMap.get(id);
  oldContent[key] = status;
  oldMap.set(id, oldContent);
  return oldMap;
}

export default function data(state: IDataState, action: DataAction): IDataState {

  const stateKey = `${action.contentType}List`;

  switch (action.type) {
    case DataActionType.UPDATE_SEMESTER:
      // switch to new semester, remove all content
      return {
        ...initialState,
        semester: action.semester,
      };
    case DataActionType.UPDATE_COURSES:
      // update course list
      // any content that belongs to removed courses will be removed in following steps
      const courseMap = new Map<string, CourseInfo>();
      for (const c of action.courseList) {
        courseMap.set(c.id, c);
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
    default:
      return state;
  }
}
