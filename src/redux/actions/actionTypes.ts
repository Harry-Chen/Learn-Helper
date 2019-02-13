export enum UiActionType {
  PROGRESS_BAR_VISIBILITY = 'UI/progress_bar_visibility',
  PROGRESS_BAR_PROGRESS = 'UI/progress_bar_progress',
  SNACKBAR_VISIBILITY = 'UI/snackbar_visibility',
  SNACKBAR_CONTENT = 'UI/snackbar_content',
  LOGIN_DIALOG_VISIBILITY = 'UI/login_dialog_visibility',
  LOGIN_DIALOG_PROGRESS = 'UI/login_dialog_progress',
  NETWORK_ERROR_DIALOG_VISIBILITY = 'UI/network_error_dialog_visibility',
  PANE_VISIBILITY = 'UI/pane_visibility',
}

export enum HelperActionType {
  LOGIN = 'HELPER/login',
  LOGOUT = 'HELPER/logout',
}

export enum DataActionType {
  NEW_SEMESTER = 'DATA/new_semester',
  UPDATE_SEMESTER = 'DATA/update_semester',
  UPDATE_COURSES = 'DATA/update_courses',
  UPDATE_CONTENT = 'DATA/update_content',
  TOGGLE_READ_STATE = 'DATA/toggle_read_state',
  TOGGLE_STAR_STATE = 'DATA/toggle_star_state',
}
