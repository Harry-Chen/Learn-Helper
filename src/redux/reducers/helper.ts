import { Learn2018Helper } from 'thu-learn-lib/lib';
import { HelperActionType } from '../actions/actionTypes';
import { AnyAction } from 'redux';

interface IHelperState {
  helper: Learn2018Helper;
  loggedIn: boolean;
}

export type HelperState = IHelperState;

const initialState: HelperState = {
  helper: new Learn2018Helper(),
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
        helper: new Learn2018Helper(),
        loggedIn: false,
      };
    default:
      return state;
  }
}
