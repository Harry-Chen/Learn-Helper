import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import styles from '../css/list.module.css';
import '../constants/fontAwesome';
import { CourseListProps } from '../types/ui';
import { COURSE_FUNC, COURSE_FUNC_LIST, COURSE_ICON } from '../constants/ui';
import { STATE_DATA, STATE_HELPER } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { setCardFilter, setCardListTitle, setDetailUrl } from '../redux/actions/ui';
import { HelperState } from '../redux/reducers/helper';

class CourseList extends React.PureComponent<
  CourseListProps,
  {
    opened: {
      [key: string]: boolean;
    };
  }
> {
  public state = { opened: {} };

  constructor(props) {
    super(props);
    this.closeAllItems();
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
            <span className={styles.list_title}>本学期课程</span>
          </ListSubheader>
        }
      >
        {courses.length == 0 ? (
          <span className={styles.list_title}>这里什么也没有，快去选点课吧！</span>
        ) : (
          courses.map((c) => (
            <div key={c.id}>
              <ListItem
                className={styles.sidebar_list_item}
                button
                onClick={() => this.handleClick(c.id)}
              >
                <ListItemIcon className={styles.list_item_icon}>
                  <FontAwesomeIcon icon={COURSE_ICON} />
                </ListItemIcon>
                <ListItemText primary={c.name} className={styles.course_list_item_text} />
                <FontAwesomeIcon icon={this.state.opened[c.id] ? 'angle-up' : 'angle-down'} />
              </ListItem>
              <Collapse in={this.state.opened[c.id]} timeout="auto" unmountOnExit>
                <List className={styles.subfunc_list} disablePadding>
                  {COURSE_FUNC_LIST.map((func) => (
                    <ListItem
                      className={styles.sidebar_list_item}
                      button
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
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))
        )}
      </List>
    );
  }

  private closeAllItems = () => {
    this.props.courses.map((i) => (this.state.opened[i.id] = false));
  };

  private handleClick = (id) => {
    const nextState = !this.state.opened[id];
    this.closeAllItems();
    this.setState({
      opened: { ...this.state.opened, [id]: nextState },
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
