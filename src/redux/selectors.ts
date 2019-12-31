import { ContentType, CourseInfo, Homework } from 'thu-learn-lib/lib/types';

import { DataState } from './reducers/data';
import { ContentInfo } from '../types/data';
import { CardListProps } from '../types/ui';
import { STATE_DATA } from './reducers';

export function getCourseIdListForContent(getState: () => any, contentType: ContentType) {
  const data = getState()[STATE_DATA] as DataState;
  const courseIDs = [...data.courseMap.keys()];
  return courseIDs.filter(id => !data.contentIgnore[id][contentType]);
}

let oldType: ContentType;
let oldCourse: CourseInfo;
let allContent: ContentInfo[];
let oldCards: ContentInfo[];
let lastRegenerateTime: Date;

export const generateCardList = (
  data: DataState,
  lastUpdateTime: Date,
  type?: ContentType,
  course?: CourseInfo,
  title?: string,
): Partial<CardListProps> => {
  let newCards: ContentInfo[] = [];

  if (
    type === oldType &&
    course === oldCourse &&
    oldCards !== undefined &&
    lastRegenerateTime === lastUpdateTime
  ) {
    // filter and data not changed, use filtered & sorted sequence
    // just fetch the latest state
    newCards = oldCards.map(l => data[`${l.type}Map`].get(l.id));
  } else {
    // filter or data changed, re-calculate visibility and sequence

    if (lastUpdateTime !== lastRegenerateTime) {
      // data updated from network, generate data from scratch
      allContent = [];
      for (const [key, content] of Object.entries(data)) {
        if (key.startsWith('course') || !key.endsWith('Map')) continue;
        const source = content as Map<string, ContentInfo>;
        for (const item of source.values()) {
          allContent.push(item);
        }
      }
      lastRegenerateTime = lastUpdateTime;
    }

    // filter cards to show
    newCards = allContent.map(l => data[`${l.type}Map`].get(l.id));
    if (type === null) {
      // show ignored items
      newCards = newCards.filter(l => l.ignored);
    } else {
      // normal items
      if (type !== undefined) newCards = newCards.filter(l => l.type === type);
      if (course !== undefined) {
        newCards = newCards.filter(l => l.courseId === course.id);
      } else {
        // in summary list, respect all ignore marks
        newCards = newCards.filter(l => !data.contentIgnore[l.courseId][l.type] && !l.ignored);
      }
    }

    const compareBoolean = (a: boolean, b: boolean) => {
      if (a && b) return 0;
      if (a) return -1;
      if (b) return 1;
    }

    // sort by starred, hasRead, notDue (homework only), and time
    newCards.sort((a, b) => {

      let result = compareBoolean(a.starred, b.starred);
      if (result != 0) return result;
      result = compareBoolean(!a.hasRead, !b.hasRead);
      if (result != 0) return result;
      const aNotDue = a.type === ContentType.HOMEWORK && a.date.getTime() > new Date().getTime();
      const bNotDue = b.type === ContentType.HOMEWORK && b.date.getTime() > new Date().getTime();
      result = compareBoolean(aNotDue, bNotDue);
      if (result != 0) return result;
      return b.date.getTime() - a.date.getTime()

    });
  }

  oldType = type;
  oldCourse = course;
  oldCards = newCards;

  if (title !== undefined) {
    newCards = newCards.filter(l =>
      l.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()),
    );
  }

  return {
    contents: newCards,
  };
};
