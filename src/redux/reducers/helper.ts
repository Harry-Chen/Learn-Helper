import { Learn2018Helper } from 'thu-learn-lib';
import { HelperConfig } from 'thu-learn-lib/lib/types';
import { AnyAction } from 'redux';

import { HelperActionType } from '../actions/actionTypes';

interface IHelperState {
  helper: Learn2018Helper;
  loggedIn: boolean;
}

export type HelperState = IHelperState;

const config: HelperConfig = {
  fixCourseEnglishName: true,
};

const initialState: HelperState = {
  helper: new Learn2018Helper(config),
  loggedIn: false,
};

export default function helper(state: HelperState = initialState, action: AnyAction): HelperState {
  switch (action.type) {
    case HelperActionType.LOGIN:
      return {
        ...state,
        loggedIn: true,
      };
    case HelperActionType.LOGOUT:
      return {
        helper: new Learn2018Helper(config),
        loggedIn: false,
      };
    default:
      return state;
  }
}
