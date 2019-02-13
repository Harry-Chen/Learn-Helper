import { DataActionType } from './actionTypes';
import {
  ContentType,
  CourseContent,
  CourseInfo,
  SemesterInfo,
} from 'thu-learn-lib/lib/types';

interface IDataAction {
  type: DataActionType;
  id: string;
  semester?: SemesterInfo;
  courseList?: CourseInfo[];
  content?: CourseContent;
  state?: boolean;
  contentType?: ContentType;
}

export type DataAction = IDataAction;

export function updateSemester(s: SemesterInfo) {
  return {
    type: DataActionType.UPDATE_SEMESTER,
    semester: s,
  };
};

export function updateCourses(c: CourseInfo[]) {
  return {
    type: DataActionType.UPDATE_COURSES,
    courseList: c,
  };
};

export function updateNotification(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.NOTIFICATION,
  };
};

export function updateFile(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.FILE,
  };
};

export function updateHomework(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.HOMEWORK,
  };
};

export function updateDiscussion(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.DISCUSSION,
  };
};

export function updateQuestion(content: CourseContent) {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.NOTIFICATION,
  };
};

export function toggleReadState(id: string, status: boolean, contentType: ContentType) {
  return {
    type: DataActionType.TOGGLE_READ_STATE,
    id,
    status,
    contentType,
  };
};

export function toggleStarState(id: string, status: boolean, contentType: ContentType) {
  return {
    type: DataActionType.TOGGLE_STAR_STATE,
    id,
    status,
    contentType,
  };
};
