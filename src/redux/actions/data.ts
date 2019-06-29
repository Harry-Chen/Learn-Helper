import { ContentType, CourseContent, CourseInfo, SemesterInfo } from 'thu-learn-lib/lib/types';

import { DataActionType } from './actionTypes';

interface IDataAction {
  type: DataActionType;
  id?: string;
  insist?: boolean;
  semester?: SemesterInfo;
  courseList?: CourseInfo[];
  content?: CourseContent;
  state?: boolean;
  contentType?: ContentType;
}

export type DataAction = IDataAction;

export function newSemester(semester: SemesterInfo): DataAction {
  return {
    type: DataActionType.NEW_SEMESTER,
    semester,
  };
}

export function insistSemester(insist: boolean): DataAction {
  return {
    type: DataActionType.INSIST_SEMESTER,
    insist,
  };
}

export function updateSemester(semester: SemesterInfo): DataAction {
  return {
    type: DataActionType.UPDATE_SEMESTER,
    semester,
  };
}

export function updateCourses(courseList: CourseInfo[]): DataAction {
  return {
    type: DataActionType.UPDATE_COURSES,
    courseList,
  };
}

export function toggleContentIgnore(
  courseId: string,
  contentType: ContentType,
  ignore: boolean,
): DataAction {
  return {
    type: DataActionType.TOGGLE_CONTENT_IGNORE,
    id: courseId,
    contentType,
    state: ignore,
  };
}

export function resetContentIgnore(): DataAction {
  return {
    type: DataActionType.RESET_CONTENT_IGNORE,
  };
}

export function updateNotification(content: CourseContent): DataAction {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.NOTIFICATION,
  };
}

export function updateFile(content: CourseContent): DataAction {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.FILE,
  };
}

export function updateHomework(content: CourseContent): DataAction {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.HOMEWORK,
  };
}

export function updateDiscussion(content: CourseContent): DataAction {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.DISCUSSION,
  };
}

export function updateQuestion(content: CourseContent): DataAction {
  return {
    type: DataActionType.UPDATE_CONTENT,
    content,
    contentType: ContentType.QUESTION,
  };
}

export function markAllRead(): DataAction {
  return {
    type: DataActionType.MARK_ALL_READ,
  };
}

export function toggleReadState(id: string, state: boolean, contentType: ContentType): DataAction {
  return {
    type: DataActionType.TOGGLE_READ_STATE,
    id,
    state,
    contentType,
  };
}

export function toggleIgnoreState(
  id: string,
  state: boolean,
  contentType: ContentType,
): DataAction {
  return {
    type: DataActionType.TOGGLE_IGNORE_STATE,
    id,
    state,
    contentType,
  };
}

export function toggleStarState(id: string, state: boolean, contentType: ContentType): DataAction {
  return {
    type: DataActionType.TOGGLE_STAR_STATE,
    id,
    state,
    contentType,
  };
}

export function clearAllData(): DataAction {
  return {
    type: DataActionType.CLEAR_DATA,
  };
}

export function updateFinished(): DataAction {
  return {
    type: DataActionType.UPDATE_FINISHED,
  };
}
