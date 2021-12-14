export enum UiActionType {
  PROGRESS_BAR_VISIBILITY = 'UI/progress_bar_visibility',
  PROGRESS_BAR_PROGRESS = 'UI/progress_bar_progress',
  SNACKBAR_VISIBILITY = 'UI/snackbar_visibility',
  SNACKBAR_CONTENT = 'UI/snackbar_content',
  LOGIN_DIALOG_VISIBILITY = 'UI/login_dialog_visibility',
  LOGIN_DIALOG_PROGRESS = 'UI/login_dialog_progress',
  NETWORK_ERROR_DIALOG_VISIBILITY = 'UI/network_error_dialog_visibility',
  PANE_VISIBILITY = 'UI/pane_visibility',
  NEW_SEMESTER_DIALOG_VISIBILITY = 'UI/new_semester_dialog_visibility',
  IGNORE_WRONG_SEMESTER = 'UI/ignore_wrong_semester',
  TOGGLE_LOGOUT_DIALOG = 'UI/toggle_logout_dialog',
  TOGGLE_CLEAR_DATA_DIALOG = 'UI/toggle_clear_data_dialog',
  TOGGLE_CHANGE_SEMESTER_DIALOG = 'UI/toggle_change_semester_dialog',
  CARD_FILTER = 'UI/card_filter',
  CARD_LIST_TITLE = 'UI/card_list_title',
  // CardList 排序规则
  CARD_SELECT_SORT_RULE = 'UI/card_select_sort_rule',
  CARD_RESET_SORT_RULE = 'UI/card_reset_sort_rule',
  CARD_SET_SORT_RULE_LIST = 'UI/card_set_sort_rule_list',
  // CardList 过滤规则
  CARD_SELECT_FILTER_RULE = 'UI/card_select_filter_rule',
  CARD_SET_FILTER_RULE_LIST = 'UI/card_set_filter_rule_list',
  LOAD_MORE_CARD = 'UI/load_more_card',
  SET_DETAIL_URL = 'UI/set_detail_url',
  SET_DETAIL_CONTENT = 'UI/set_detail_content',
  SHOW_CONTENT_IGNORE_SETTING = 'UI/show_content_ignore_setting',
  SET_TITLE_FILTER = 'UI/set_title_filter',
}

export enum HelperActionType {
  LOGIN = 'HELPER/login',
  LOGOUT = 'HELPER/logout',
}

export enum DataActionType {
  UPDATE_SEMESTER_LIST = 'DATA/update_semester_list',
  NEW_SEMESTER = 'DATA/new_semester',
  INSIST_SEMESTER = 'DATA/insist_semester',
  UPDATE_SEMESTER = 'DATA/update_semester',
  UPDATE_COURSES = 'DATA/update_courses',
  UPDATE_CONTENT = 'DATA/update_content',
  TOGGLE_CONTENT_IGNORE = 'DATA/toggle_content_ignore',
  RESET_CONTENT_IGNORE = 'DATA/reset_content_ignore',
  MARK_ALL_READ = 'DATA/mark_all_read',
  TOGGLE_READ_STATE = 'DATA/toggle_read_state',
  TOGGLE_STAR_STATE = 'DATA/toggle_star_state',
  TOGGLE_IGNORE_STATE = 'DATA/toggle_ignore_state',
  CLEAR_FETCHED_DATA = 'DATA/clear_fetched_data',
  CLEAR_ALL_DATA = 'DATA/clear_all_data',
  UPDATE_FINISHED = 'DATA/update_finished',
}
