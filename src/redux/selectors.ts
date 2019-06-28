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
    if (type !== undefined) newCards = newCards.filter(l => l.type === type);
    if (course !== undefined) {
      newCards = newCards.filter(l => l.courseId === course.id);
    } else {
      // in summary list, respect all ignore marks
      newCards = newCards.filter(l =>
        !data.contentIgnore[l.courseId][l.type] && !l.ignored);
    }

    // title filter change does not trigger re-sorting
    // sort by starred, hasRead and time
    // unfinished homework before deadline always comes before everything regular cards
    newCards.sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      if (!a.hasRead && b.hasRead) return -1;
      if (a.hasRead && !b.hasRead) return 1;
      if (a.type === ContentType.HOMEWORK
        && (a as Homework).deadline.getTime() > new Date().getTime()) {
        return -1;
      }
      if (b.type === ContentType.HOMEWORK
        && (b as Homework).deadline.getTime() > new Date().getTime()) {
        return 1;
      }
      return b.date.getTime() - a.date.getTime();
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
