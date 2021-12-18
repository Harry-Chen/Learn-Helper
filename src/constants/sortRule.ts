/**
 * Description: 用于 CardList 中的排序
 * Author: leonardodalinky
 */
import { CardSortRule } from '../types/ui';
import { HomeworkInfo } from '../types/data';

const DATE_SORT_RULE: CardSortRule = {
  name: '按日期排序',
  keyExtractor: (content) => content.date,
  iconName: 'calendar-alt',
};

const DDL_SORT_RULE: CardSortRule = {
  name: '按 DDL 排序',
  keyExtractor: (content) => (content as HomeworkInfo).deadline,
  iconName: 'stopwatch',
};

const TITLE_SORT_RULE: CardSortRule = {
  name: '按名称排序',
  keyExtractor: (content) => content.title,
  iconName: 'flag',
};

const COURSE_NAME_SORT_RULE: CardSortRule = {
  name: '按课程名称排序',
  keyExtractor: (content) => content.courseName,
  iconName: 'book',
};

// 普通规则
export const COMMON_SORT_RULES = [DATE_SORT_RULE, TITLE_SORT_RULE, COURSE_NAME_SORT_RULE];

// 作业规则
export const HOMEWORK_SORT_RULES = [
  DDL_SORT_RULE,
  DATE_SORT_RULE,
  TITLE_SORT_RULE,
  COURSE_NAME_SORT_RULE,
];
