import { ContentType } from 'thu-learn-lib/lib/types';
import { STATE_DATA } from './reducers';
import { DataState } from './reducers/data';

// TODO: implement filter
export function getCourseIdListForContent(getState: () => any, contentType: ContentType) {
  const courseMap = (getState()[STATE_DATA] as DataState).courseMap;
  return [...courseMap.keys()];
}
