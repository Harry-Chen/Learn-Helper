import {
  ContentType,
  type CourseContent,
  type CourseInfo,
  type Homework,
  type SemesterInfo,
  SemesterType,
} from 'thu-learn-lib/lib/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  type ContentInfo,
  type DiscussionInfo,
  type FileInfo,
  type HomeworkInfo,
  type NotificationInfo,
  type QuestionInfo,
} from '../../types/data';

interface IContentIgnore {
  [courseId: string]: {
    [type: string]: boolean;
  };
}

export interface DataState {
  semesters: string[]; // all available semesters return by Web Learning
  semester: SemesterInfo; // current semester of Learn Helper
  fetchedSemester: SemesterInfo; // current semester of Web Learning
  insistSemester: boolean;
  courseMap: Map<string, CourseInfo>;
  notificationMap: Map<string, NotificationInfo>;
  fileMap: Map<string, FileInfo>;
  homeworkMap: Map<string, HomeworkInfo>;
  discussionMap: Map<string, DiscussionInfo>;
  questionMap: Map<string, QuestionInfo>;
  lastUpdateTime: Date;
  updateFinished: boolean;
  contentIgnore: IContentIgnore;
}

const semesterPlaceholder: SemesterInfo = {
  id: '',
  startDate: new Date(),
  endDate: new Date(),
  startYear: 0,
  endYear: 0,
  type: SemesterType.UNKNOWN,
};

const initialState: DataState = {
  semesters: [],
  semester: semesterPlaceholder,
  fetchedSemester: semesterPlaceholder,
  insistSemester: false,
  courseMap: new Map<string, CourseInfo>(),
  notificationMap: new Map<string, NotificationInfo>(),
  fileMap: new Map<string, FileInfo>(),
  homeworkMap: new Map<string, HomeworkInfo>(),
  discussionMap: new Map<string, DiscussionInfo>(),
  questionMap: new Map<string, QuestionInfo>(),
  lastUpdateTime: new Date(0),
  updateFinished: false,
  contentIgnore: {},
};

function update<T extends ContentInfo>(
  map: Map<string, T>,
  contentType: ContentType,
  fetched: CourseContent,
  courseMap: Map<string, CourseInfo>,
  _contentIgnore: IContentIgnore,
): Map<string, T> {
  let result = new Map<string, T>();

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
      const oldContent = map.get(c.id) as T;
      const newDate = c[dateKey[contentType]];
      let updated = true;
      if (oldContent !== undefined) {
        if (newDate.getTime() === oldContent[dateKey[contentType]].getTime()) {
          // the date is not modified
          updated = false;
          if (contentType === ContentType.HOMEWORK) {
            const oldGradeTime = (oldContent as Homework).gradeTime;
            const newGradeTime = (c as Homework).gradeTime;
            if (newGradeTime && !oldGradeTime) {
              // newly-graded homework
              updated = true;
            } else if (
              newGradeTime &&
              oldGradeTime &&
              // re-graded homework
              newGradeTime.getTime() !== oldGradeTime.getTime()
            ) {
              updated = true;
            }
          }
        }
      }
      // copy other attributes either way
      const newContent = {
        ...c,
        courseId,
        ignored: oldContent === undefined ? false : oldContent.ignored,
        type: contentType,
        courseName: courseMap.get(courseId).name,
        date: newDate,
        hasRead: oldContent === undefined ? false : !updated && oldContent.hasRead,
        starred: oldContent === undefined ? false : oldContent.starred,
      } as T;
      result = result.set(c.id, newContent);
    }
  }

  return result;
}

interface ToggleStatePayload {
  id: string;
  type: ContentType;
  state: boolean;
}

const IGNORE_UNSET_ALL = {
  [ContentType.NOTIFICATION]: false,
  [ContentType.FILE]: false,
  [ContentType.HOMEWORK]: false,
  [ContentType.QUESTION]: false,
  [ContentType.DISCUSSION]: false,
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    newSemester: (state, action: PayloadAction<SemesterInfo>) => {
      state.fetchedSemester = action.payload;
    },
    insistSemester: (state, action: PayloadAction<boolean>) => {
      state.insistSemester = action.payload;
    },
    updateSemesterList: (state, action: PayloadAction<string[]>) => {
      state.semesters = action.payload;
    },
    updateSemester: (state, action: PayloadAction<SemesterInfo>) => {
      state.semester = action.payload;
    },
    updateCourses: (state, action: PayloadAction<CourseInfo[]>) => {
      action.payload.sort((a, b) => a.id.localeCompare(b.id));
      state.courseMap = new Map(action.payload.map((course) => [course.id, course]));
      Object.keys(state.contentIgnore).forEach((k) => {
        if (!state.courseMap.has(k)) delete state.contentIgnore[k];
      });
      state.courseMap.forEach((course) => {
        state.contentIgnore[course.id] ??= { ...IGNORE_UNSET_ALL };
      });
    },
    updateNotification: (state, action: PayloadAction<CourseContent>) => {
      state.notificationMap = update(
        state.notificationMap,
        ContentType.NOTIFICATION,
        action.payload,
        state.courseMap,
        state.contentIgnore,
      );
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateFile: (state, action: PayloadAction<CourseContent>) => {
      state.fileMap = update(
        state.fileMap,
        ContentType.FILE,
        action.payload,
        state.courseMap,
        state.contentIgnore,
      );
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateHomework: (state, action: PayloadAction<CourseContent>) => {
      state.homeworkMap = update(
        state.homeworkMap,
        ContentType.HOMEWORK,
        action.payload,
        state.courseMap,
        state.contentIgnore,
      );
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateDiscussion: (state, action: PayloadAction<CourseContent>) => {
      state.discussionMap = update(
        state.discussionMap,
        ContentType.DISCUSSION,
        action.payload,
        state.courseMap,
        state.contentIgnore,
      );
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateQuestion: (state, action: PayloadAction<CourseContent>) => {
      state.questionMap = update(
        state.questionMap,
        ContentType.QUESTION,
        action.payload,
        state.courseMap,
        state.contentIgnore,
      );
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateFinished: (state) => {
      state.updateFinished = true;
    },
    toggleReadState: (state, action: PayloadAction<ToggleStatePayload>) => {
      state[`${action.payload.type}Map`].get(action.payload.id).hasRead = action.payload.state;
    },
    toggleStarState: (state, action: PayloadAction<ToggleStatePayload>) => {
      state[`${action.payload.type}Map`].get(action.payload.id).starred = action.payload.state;
    },
    toggleIgnoreState: (state, action: PayloadAction<ToggleStatePayload>) => {
      state[`${action.payload.type}Map`].get(action.payload.id).ignored = action.payload.state;
    },
    toggleContentIgnore: (state, action: PayloadAction<ToggleStatePayload>) => {
      state.contentIgnore[action.payload.id][action.payload.type] = action.payload.state;
    },
    resetContentIgnore: (state) => {
      state.contentIgnore = Object.fromEntries(
        [...state.courseMap.keys()].map((c) => [c, { ...IGNORE_UNSET_ALL }]),
      );
      state.updateFinished = false;
    },
    markAllRead: (state) => {
      state.notificationMap.forEach((value) => void (value.hasRead = true));
      state.fileMap.forEach((value) => void (value.hasRead = true));
      state.homeworkMap.forEach((value) => void (value.hasRead = true));
      state.discussionMap.forEach((value) => void (value.hasRead = true));
      state.questionMap.forEach((value) => void (value.hasRead = true));
    },
    clearAllData: () => {
      return initialState;
    },
    clearFetchedData: (state) => {
      state.courseMap = new Map<string, CourseInfo>();
      state.notificationMap = new Map<string, NotificationInfo>();
      state.fileMap = new Map<string, FileInfo>();
      state.homeworkMap = new Map<string, HomeworkInfo>();
      state.discussionMap = new Map<string, DiscussionInfo>();
      state.questionMap = new Map<string, QuestionInfo>();
      state.lastUpdateTime = new Date(0);
    },
  },
});

export const {
  newSemester,
  insistSemester,
  updateSemesterList,
  updateSemester,
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
} = dataSlice.actions;

export default dataSlice.reducer;
