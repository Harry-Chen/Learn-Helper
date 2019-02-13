import { combineReducers } from 'redux';

import ui, { UiState } from './ui';
import helper from './helper';

export const STATE_UI = 'ui';
export const STATE_HELPER = 'helper';

const reducers = combineReducers({
  [STATE_UI]: ui,
  [STATE_HELPER]: helper,
});

export default reducers;

export interface IUiStateSlice {
  [STATE_UI]: UiState;
}
