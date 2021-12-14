import { ContentType, CourseInfo } from 'thu-learn-lib/lib/types';

import { SnackbarType } from '../../types/dialogs';
import { UiActionType } from '../actions/actionTypes';
import { UiAction } from '../actions/ui';
import { CARD_BATCH_LOAD_SIZE } from '../../constants';
import { ContentInfo } from '../../types/data';
import { CardFilterRule, CardSortRule } from '../../types/ui';

interface IUiState {
  showLoadingProgressBar: boolean;
  loadingProgress: number;
  paneHidden: boolean;
  showSnackbar: boolean;
  snackbarContent: string;
  snackbarType: SnackbarType;
  showLoginDialog: boolean;
  inLoginProgress: boolean;
  showNetworkErrorDialog: boolean;
  showNewSemesterDialog: boolean;
  showChangeSemesterDialog: boolean;
  ignoreWrongSemester: boolean;
  showLogoutDialog: boolean;
  showClearDataDialog: boolean;
  cardTypeFilter?: ContentType | null;
  cardVisibilityThreshold: number;
  cardCourseFilter?: CourseInfo;
  cardSelectSortRules?: CardSortRule[];
  cardSortOrders?: ('asc' | 'desc')[];
  cardSortRuleList?: CardSortRule[];
  cardSelectFilterRules?: CardFilterRule[];
  cardFilterRuleList?: CardFilterRule[];
  cardListTitle: string;
  detailUrl: string;
  detailContent?: ContentInfo;
  showContentIgnoreSetting: boolean;
  titleFilter?: string;
}

export type UiState = IUiState;

const initialState: UiState = {
  showLoadingProgressBar: false,
  loadingProgress: 0,
  paneHidden: false,
  showSnackbar: false,
  snackbarContent: '',
  snackbarType: SnackbarType.NOTIFICATION,
  showLoginDialog: false,
  inLoginProgress: false,
  showNetworkErrorDialog: false,
  showNewSemesterDialog: false,
  ignoreWrongSemester: false,
  showLogoutDialog: false,
  showClearDataDialog: false,
  showChangeSemesterDialog: false,
  cardTypeFilter: undefined,
  cardVisibilityThreshold: CARD_BATCH_LOAD_SIZE,
  cardCourseFilter: undefined,
  cardSelectSortRules: undefined,
  cardSortOrders: undefined,
  cardSortRuleList: undefined,
  cardSelectFilterRules: undefined,
  cardFilterRuleList: undefined,
  cardListTitle: '主页',
  detailUrl: 'welcome.html',
  detailContent: undefined,
  showContentIgnoreSetting: false,
  titleFilter: undefined,
};

export default function ui(state: UiState = initialState, action: UiAction): UiState {
  switch (action.type) {
    case UiActionType.PROGRESS_BAR_VISIBILITY:
      return {
        ...state,
        showLoadingProgressBar: action.state,
      };
    case UiActionType.PROGRESS_BAR_PROGRESS:
      return {
        ...state,
        loadingProgress: action.loadingProgress,
      };
    case UiActionType.SNACKBAR_VISIBILITY:
      return {
        ...state,
        showSnackbar: action.state,
      };
    case UiActionType.SNACKBAR_CONTENT:
      return {
        ...state,
        snackbarType: action.snackbarType,
        snackbarContent: action.snackbarContent,
      };
    case UiActionType.LOGIN_DIALOG_VISIBILITY:
      return {
        ...state,
        showLoginDialog: action.state,
      };
    case UiActionType.LOGIN_DIALOG_PROGRESS:
      return {
        ...state,
        inLoginProgress: action.state,
      };
    case UiActionType.NETWORK_ERROR_DIALOG_VISIBILITY:
      return {
        ...state,
        showNetworkErrorDialog: action.state,
      };
    case UiActionType.PANE_VISIBILITY:
      return {
        ...state,
        paneHidden: action.state,
      };
    case UiActionType.NEW_SEMESTER_DIALOG_VISIBILITY:
      return {
        ...state,
        showNewSemesterDialog: action.state,
      };
    case UiActionType.IGNORE_WRONG_SEMESTER:
      return {
        ...state,
        ignoreWrongSemester: action.state,
      };
    case UiActionType.TOGGLE_CLEAR_DATA_DIALOG:
      return {
        ...state,
        showClearDataDialog: action.state,
      };
    case UiActionType.TOGGLE_CHANGE_SEMESTER_DIALOG:
      return {
        ...state,
        showChangeSemesterDialog: action.state,
      };
    case UiActionType.TOGGLE_LOGOUT_DIALOG:
      return {
        ...state,
        showLogoutDialog: action.state,
      };
    case UiActionType.CARD_FILTER:
      return {
        ...state,
        cardTypeFilter: action.cardType,
        cardCourseFilter: action.cardCourse,
        cardVisibilityThreshold: 10,
      };
    case UiActionType.CARD_LIST_TITLE:
      return {
        ...state,
        cardListTitle: action.title,
      };
    case UiActionType.CARD_SELECT_SORT_RULE: {
      // 增加排序规则，如果已经有了则不加
      if (
        state.cardSelectSortRules &&
        state.cardSelectSortRules.find((value) => value.name === action.sortRule.name) != null
      ) {
        return state;
      }
      let newRules: CardSortRule[];
      let newOrders: ('asc' | 'desc')[];
      if (state.cardSelectSortRules == undefined) {
        newRules = [action.sortRule];
      } else {
        newRules = [...state.cardSelectSortRules];
        newRules.push(action.sortRule);
      }
      if (state.cardSortOrders == undefined) {
        newOrders = [action.sortOrder];
      } else {
        newOrders = [...state.cardSortOrders];
        newOrders.push(action.sortOrder);
      }
      return {
        ...state,
        cardSelectSortRules: newRules,
        cardSortOrders: newOrders,
      };
    }
    case UiActionType.CARD_RESET_SORT_RULE:
      return {
        ...state,
        cardSelectSortRules: undefined,
        cardSortOrders: undefined,
      };
    case UiActionType.CARD_SET_SORT_RULE_LIST:
      return {
        ...state,
        cardSortRuleList: action.sortRuleList,
        cardSelectSortRules: undefined,
        cardSortOrders: undefined,
      };
    case UiActionType.CARD_SELECT_FILTER_RULE: {
      // 增加过滤规则
      let newRules: CardFilterRule[];
      if (state.cardSelectFilterRules == undefined) {
        newRules = [action.filterRule];
      } else {
        newRules = [...state.cardSelectFilterRules];
        const findResult = newRules.find((value) => value.name === action.filterRule.name);
        if (findResult) {
          // 清除已有
          newRules = newRules.filter((value) => value.name !== findResult.name);
        } else {
          // 新增规则
          newRules.push(action.filterRule);
        }
      }
      return {
        ...state,
        cardSelectFilterRules: newRules,
      };
    }
    case UiActionType.CARD_SET_FILTER_RULE_LIST:
      return {
        ...state,
        cardFilterRuleList: action.filterRuleList,
        cardSelectFilterRules: undefined,
      };
    case UiActionType.LOAD_MORE_CARD:
      return {
        ...state,
        cardVisibilityThreshold: state.cardVisibilityThreshold + CARD_BATCH_LOAD_SIZE,
      };
    case UiActionType.SET_DETAIL_URL:
      return {
        ...state,
        detailUrl: action.url,
        detailContent: undefined,
        showContentIgnoreSetting: false,
      };
    case UiActionType.SET_DETAIL_CONTENT:
      return {
        ...state,
        detailContent: action.content,
        showContentIgnoreSetting: false,
      };
    case UiActionType.SHOW_CONTENT_IGNORE_SETTING:
      return {
        ...state,
        showContentIgnoreSetting: true,
      };
    case UiActionType.SET_TITLE_FILTER:
      return {
        ...state,
        titleFilter: action.title,
      };
    default:
      return state;
  }
}
