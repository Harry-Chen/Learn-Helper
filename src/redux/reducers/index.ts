import { combineReducers } from 'redux';

import ui, { UiState } from './ui';
import helper from './helper';
import data from './data';

export const STATE_UI = 'ui';
export const STATE_HELPER = 'helper';
export const STATE_DATA = 'data';

const reducers = combineReducers({
  [STATE_UI]: ui,
  [STATE_HELPER]: helper,
  [STATE_DATA]: data,
});

export default reducers;

export interface IUiStateSlice {
  [STATE_UI]: UiState;
}
