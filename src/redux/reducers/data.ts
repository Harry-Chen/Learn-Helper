import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  ContentType,
  type CourseContent,
  type CourseInfo,
  type Homework,
  type SemesterInfo,
  SemesterType,
} from 'thu-learn-lib';

import {
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
  courseMap: Record<string, CourseInfo>;
  notificationMap: Record<string, NotificationInfo>;
  fileMap: Record<string, FileInfo>;
  homeworkMap: Record<string, HomeworkInfo>;
  discussionMap: Record<string, DiscussionInfo>;
  questionMap: Record<string, QuestionInfo>;
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
  courseMap: {},
  notificationMap: {},
  fileMap: {},
  homeworkMap: {},
  discussionMap: {},
  questionMap: {},
  lastUpdateTime: new Date(0),
  updateFinished: false,
  contentIgnore: {},
};

function update(state: DataState, contentType: ContentType, fetchedData: CourseContent) {
  const oldData = state[`${contentType}Map`];

  const result = {};
  const dateKeyMap = {
    [ContentType.NOTIFICATION]: 'publishTime',
    [ContentType.FILE]: 'uploadTime',
    [ContentType.HOMEWORK]: 'deadline',
    [ContentType.DISCUSSION]: 'publishTime',
    [ContentType.QUESTION]: 'publishTime',
  };
  const dateKey = dateKeyMap[contentType];

  // we always use the fetched data
  for (const [cid, contents] of Object.entries(fetchedData)) {
    for (const c of contents) {
      // compare the time of two contents (including undefined)
      // if they differ, mark the content as unread
      const oldContent = oldData[c.id];
      const newDate = c[dateKey];
      let updated = true;
      if (oldContent) {
        if (newDate.getTime() === oldContent[dateKey].getTime()) {
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
      result[c.id] = {
        ...c,
        courseId: cid,
        ignored: oldContent?.ignored ?? false,
        type: contentType,
        date: newDate,
        hasRead: !updated && (oldContent?.hasRead ?? false),
        starred: oldContent?.starred ?? false,
      };
    }
  }

  state[`${contentType}Map`] = result;
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
    syncSemester: (state) => {
      state.semester = state.fetchedSemester;
    },
    updateCourses: (state, action: PayloadAction<CourseInfo[]>) => {
      action.payload.sort((a, b) => a.id.localeCompare(b.id));
      state.courseMap = Object.fromEntries(action.payload.map((course) => [course.id, course]));
      Object.keys(state.contentIgnore).forEach((cid) => {
        if (!state.courseMap[cid]) delete state.contentIgnore[cid];
      });
      Object.keys(state.courseMap).forEach((cid) => {
        state.contentIgnore[cid] ??= { ...IGNORE_UNSET_ALL };
      });
    },
    updateNotification: (state, action: PayloadAction<CourseContent>) => {
      update(state, ContentType.NOTIFICATION, action.payload);
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateFile: (state, action: PayloadAction<CourseContent>) => {
      update(state, ContentType.FILE, action.payload);
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateHomework: (state, action: PayloadAction<CourseContent>) => {
      update(state, ContentType.HOMEWORK, action.payload);
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateDiscussion: (state, action: PayloadAction<CourseContent>) => {
      update(state, ContentType.DISCUSSION, action.payload);
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateQuestion: (state, action: PayloadAction<CourseContent>) => {
      update(state, ContentType.QUESTION, action.payload);
      state.lastUpdateTime = new Date();
      state.updateFinished = false;
    },
    updateFinished: (state) => {
      state.updateFinished = true;
    },
    toggleReadState: (state, action: PayloadAction<ToggleStatePayload>) => {
      state[`${action.payload.type}Map`][action.payload.id].hasRead = action.payload.state;
    },
    toggleStarState: (state, action: PayloadAction<ToggleStatePayload>) => {
      state[`${action.payload.type}Map`][action.payload.id].starred = action.payload.state;
    },
    toggleIgnoreState: (state, action: PayloadAction<ToggleStatePayload>) => {
      state[`${action.payload.type}Map`][action.payload.id].ignored = action.payload.state;
    },
    toggleContentIgnore: (state, action: PayloadAction<ToggleStatePayload>) => {
      state.contentIgnore[action.payload.id][action.payload.type] = action.payload.state;
    },
    resetContentIgnore: (state) => {
      state.contentIgnore = Object.fromEntries(
        Object.keys(state.courseMap).map((cid) => [cid, { ...IGNORE_UNSET_ALL }]),
      );
      state.updateFinished = false;
    },
    markAllRead: (state) => {
      Object.values(state.notificationMap).forEach((c) => void (c.hasRead = true));
      Object.values(state.fileMap).forEach((c) => void (c.hasRead = true));
      Object.values(state.homeworkMap).forEach((c) => void (c.hasRead = true));
      Object.values(state.discussionMap).forEach((c) => void (c.hasRead = true));
      Object.values(state.questionMap).forEach((c) => void (c.hasRead = true));
    },
    clearAllData: () => {
      return initialState;
    },
    clearFetchedData: (state) => {
      state.courseMap = {};
      state.notificationMap = {};
      state.fileMap = {};
      state.homeworkMap = {};
      state.discussionMap = {};
      state.questionMap = {};
      state.lastUpdateTime = new Date(0);
    },
    loadData: (_state, action: PayloadAction<Partial<DataState>>) => {
      return { ...initialState, ...action.payload };
    },
  },
});

export default dataSlice.reducer;
