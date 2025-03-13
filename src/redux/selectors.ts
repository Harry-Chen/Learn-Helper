import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { memoize } from 'proxy-memoize';
import { ContentType } from 'thu-learn-lib';

import { UI_NAME_COURSE, UI_NAME_SUMMARY } from '../constants/ui';
import type { ContentInfo } from '../types/data';
import type { RootState } from './store';

export const selectCourseList = memoize((state: RootState) => Object.values(state.data.courseMap));

export const selectNotificationList = memoize((state: RootState) =>
  Object.values(state.data.notificationMap),
);
export const selectFileList = memoize((state: RootState) => Object.values(state.data.fileMap));
export const selectHomeworkList = memoize((state: RootState) =>
  Object.values(state.data.homeworkMap),
);
export const selectDiscussionList = memoize((state: RootState) =>
  Object.values(state.data.discussionMap),
);
export const selectQuestionList = memoize((state: RootState) =>
  Object.values(state.data.questionMap),
);
export const selectDataLists = memoize((state: RootState) => ({
  notificationList: selectNotificationList(state),
  fileList: selectFileList(state),
  homeworkList: selectHomeworkList(state),
  discussionList: selectDiscussionList(state),
  questionList: selectQuestionList(state),
}));

export const selectContentIgnore = (state: RootState) => state.data.contentIgnore;

export const selectUnreadMap = memoize((state: RootState) => {
  const { notificationList, fileList, homeworkList, discussionList, questionList } =
    selectDataLists(state);
  const contentIgnore = selectContentIgnore(state);

  const count = (type: ContentType, list: ContentInfo[]) =>
    list.reduce(
      (cnt, c) =>
        cnt +
        Number(
          !c.ignored &&
            contentIgnore[c.courseId]?.[type] === false &&
            (!c.hasRead || // all unread content
              // unfinished homework before deadline
              (c.type === ContentType.HOMEWORK &&
                !c.submitted &&
                c?.deadline?.getTime() > new Date().getTime())),
        ),
      0,
    );

  return state.helper.loggedIn
    ? {
        notification: count(ContentType.NOTIFICATION, notificationList),
        file: count(ContentType.FILE, fileList),
        homework: count(ContentType.HOMEWORK, homeworkList),
        discussion: count(ContentType.DISCUSSION, discussionList),
        question: count(ContentType.QUESTION, questionList),
        ignored: 0,
      }
    : {};
});

export const selectSemesters = memoize((state: RootState) => {
  const { semesters, fetchedSemester } = state.data;
  if (!semesters.includes(fetchedSemester.id)) return [fetchedSemester.id, ...semesters];
  return semesters;
});

export const selectCardListTitle = memoize((state: RootState): MessageDescriptor[] => {
  if (state.helper.loggedIn) {
    if (state.ui.cardFilter.courseId && state.ui.cardFilter.type !== 'ignored') {
      return [
        UI_NAME_COURSE[state.ui.cardFilter.type ?? 'summary'],
        { id: `course-${state.ui.cardFilter.courseId}` },
      ];
    }
    return [UI_NAME_SUMMARY[state.ui.cardFilter.type ?? 'summary']];
  }
  return [msg`加载中...`];
});
