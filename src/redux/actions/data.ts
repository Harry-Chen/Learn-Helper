import { DataActionType } from './actionTypes';
import { ContentType, CourseContent, CourseInfo, SemesterInfo } from 'thu-learn-lib/lib/types';

interface IDataAction {
  type: DataActionType;
  id: string;
  insist?: boolean;
  semester?: SemesterInfo;
  courseList?: CourseInfo[];
  content?: CourseContent;
  state?: boolean;
  contentType?: ContentType;
}

export type DataAction = IDataAction;

export function newSemester(semester: SemesterInfo) {
  return {
    type: DataActionType.NEW_SEMESTER,
    semester,
  };
}

export function insistSemester(insist: boolean) {
  return {
    type: DataActionType.INSIST_SEMESTER,
    insist,
  };
}

export function updateSemester(semester: SemesterInfo) {
  return {
    type: DataActionType.UPDATE_SEMESTER,
    semester,
  };
}

export function updateCourses(courseList: CourseInfo[]) {
  return {
    type: DataActionType.UPDATE_COURSES,
    courseList,
  };
}

export function updateNotification(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.NOTIFICATION,
  };
}

export function updateFile(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.FILE,
  };
}

export function updateHomework(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.HOMEWORK,
  };
}

export function updateDiscussion(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.DISCUSSION,
  };
}

export function updateQuestion(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.QUESTION,
  };
}

export function markAllRead() {
  return {
    type: DataActionType.MARK_ALL_READ,
  };
}

export function toggleReadState(id: string, state: boolean, contentType: ContentType) {
  return {
    type: DataActionType.TOGGLE_READ_STATE,
    id,
    state,
    contentType,
  };
}

export function toggleStarState(id: string, state: boolean, contentType: ContentType) {
  return {
    type: DataActionType.TOGGLE_STAR_STATE,
    id,
    state,
    contentType,
  };
}

export function clearAllData() {
  return {
    type: DataActionType.CLEAR_DATA,
  };
}

export function updateFinished() {
  return {
    type: DataActionType.UPDATE_FINISHED,
  };
}
