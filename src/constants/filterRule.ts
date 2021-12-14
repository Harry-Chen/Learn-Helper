/**
 * Description: 用于 CardList 中的过滤规则
 * Author: leonardodalinky
 * CreatedAt: 12/14/2021
 * ModifiedAt: 12/14/2021
 */

import { HomeworkInfo } from '../types/data';
import { CardFilterRule } from '../types/ui';

const HANDED_HOMEWORK_FILTER_RULE: CardFilterRule = {
  name: '忽略已交作业',
  func: (content) => !(content as HomeworkInfo).submitted,
};

const OUTDATED_HOMEWORK_FILTER_RULE: CardFilterRule = {
  name: '忽略过期作业',
  func: (content) => (content as HomeworkInfo).deadline > new Date(),
};

export const HOMEWORK_FILTER_RULES = [HANDED_HOMEWORK_FILTER_RULE, OUTDATED_HOMEWORK_FILTER_RULE];
