import React from 'react';
import { connect } from 'react-redux';

import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../css/list.module.css';
import '../constants/fontAwesome';
import { CourseListProps } from '../types/ui';
import { COURSE_FUNC, COURSE_FUNC_LIST, COURSE_ICON } from '../constants/ui';
import { STATE_DATA, STATE_HELPER } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { setCardFilter, setCardListTitle, setDetailUrl } from '../redux/actions/ui';
import { HelperState } from '../redux/reducers/helper';
import { t } from '../utils/i18n';

class CourseList extends React.PureComponent<
  CourseListProps,
  {
    opened: string | undefined;
  }
> {
  constructor(props: CourseListProps) {
    super(props);
    this.state = { opened: undefined };
  }

  render() {
    const { courses, dispatch } = this.props;

    return (
      <List
        className={styles.course_list}
        component="nav"
        subheader={
          <ListSubheader component="div" disableSticky>
            <FontAwesomeIcon icon="inbox" />
            <span className={styles.list_title}>{t('CourseList_CurrentSemester')}</span>
          </ListSubheader>
        }
      >
        {courses.length == 0 ? (
          <span className={styles.list_title}>{t('CourseList_Nothing')}</span>
        ) : (
          courses.map((c) => (
            <div key={c.id}>
              <ListItemButton
                className={styles.sidebar_list_item}
                onClick={() => this.handleClick(c.id)}
              >
                <ListItemIcon className={styles.list_item_icon}>
                  <FontAwesomeIcon icon={COURSE_ICON} />
                </ListItemIcon>
                <ListItemText primary={c.name} className={styles.course_list_item_text} />
                <FontAwesomeIcon icon={this.state.opened === c.id ? 'angle-up' : 'angle-down'} />
              </ListItemButton>
              <Collapse in={this.state.opened === c.id} timeout="auto" unmountOnExit>
                <List className={styles.subfunc_list} disablePadding>
                  {COURSE_FUNC_LIST.map((func) => (
                    <ListItemButton
                      className={styles.sidebar_list_item}
                      key={func.name}
                      onClick={() => {
                        if (func.name !== COURSE_FUNC.COURSE_HOMEPAGE.name) {
                          // show cards
                          dispatch(setCardFilter(func.type, c));
                          dispatch(setCardListTitle(`${func.name}-${c.name}`));
                        } else {
                          dispatch(setDetailUrl(c.url));
                        }
                      }}
                    >
                      <ListItemIcon className={styles.list_item_icon}>
                        <FontAwesomeIcon icon={func.icon} />
                      </ListItemIcon>
                      <ListItemText primary={func.name} className={styles.course_list_item_text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </div>
          ))
        )}
      </List>
    );
  }

  private handleClick = (id: string) => {
    this.setState({
      opened: this.state.opened === id ? undefined : id,
    });
  };
}

const mapStateToProps = (state): CourseListProps => {
  if (!(state[STATE_HELPER] as HelperState).loggedIn) {
    return {
      courses: [],
    };
  }
  const { courseMap } = state[STATE_DATA] as DataState;
  return {
    courses: [...courseMap.values()],
  };
};

export default connect(mapStateToProps)(CourseList);
