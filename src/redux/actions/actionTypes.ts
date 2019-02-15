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
  CARD_FILTER = 'UI/card_filter',
  CARD_LIST_TITLE = 'UI/card_list_title',
  LOAD_MORE_CARD = 'UI/load_more_card',
}

export enum HelperActionType {
  LOGIN = 'HELPER/login',
  LOGOUT = 'HELPER/logout',
}

export enum DataActionType {
  NEW_SEMESTER = 'DATA/new_semester',
  INSIST_SEMESTER = 'DATA/insist_semester',
  UPDATE_SEMESTER = 'DATA/update_semester',
  UPDATE_COURSES = 'DATA/update_courses',
  UPDATE_CONTENT = 'DATA/update_content',
  MARK_ALL_READ = 'DATA/mark_all_read',
  TOGGLE_READ_STATE = 'DATA/toggle_read_state',
  TOGGLE_STAR_STATE = 'DATA/toggle_star_state',
  CLEAR_DATA = 'DATA/clear_data',
  UPDATE_FINISHED = 'DATA/update_finished',
}
