import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/fontAwesome.ts';
import { CourseListProps } from '../types/ui';
import { COURSE_FUNC, COURSE_FUNC_LIST, COURSE_ICON } from '../constants/ui';
import { STATE_DATA, STATE_HELPER } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { connect } from 'react-redux';
import { setCardFilter, setCardListTitle } from '../redux/actions/ui';
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
          <ListSubheader component="div" disableSticky={true}>
            <FontAwesomeIcon icon={'inbox'} />
            <span className={styles.list_title}>本学期课程</span>
          </ListSubheader>
        }
      >
        {courses.map(c => (
          <div key={c.id}>
            <ListItem
              className={styles.sidebar_list_item}
              button={true}
              onClick={() => this.handleClick(c.id)}
            >
              <ListItemIcon className={styles.list_item_icon}>
                <FontAwesomeIcon icon={COURSE_ICON} />
              </ListItemIcon>
              <ListItemText primary={c.name} className={styles.course_list_item_text} />
              <FontAwesomeIcon icon={this.state.opened[c.id] ? 'angle-up' : 'angle-down'} />
            </ListItem>
            <Collapse in={this.state.opened[c.id]} timeout="auto" unmountOnExit={true}>
              <List className={styles.subfunc_list} disablePadding={true}>
                {COURSE_FUNC_LIST.map(func => (
                  <ListItem
                    className={styles.sidebar_list_item}
                    button={true}
                    key={func.name}
                    onClick={() => {
                      if (func.name !== COURSE_FUNC.COURSE_HOMEPAGE.name) {
                        // show cards
                        dispatch(setCardFilter(func.type, c));
                        dispatch(setCardListTitle(`${func.name}-${c.name}`));
                      } else {
                        // TODO open course homepage
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
        ))}
      </List>
    );
  }

  private closeAllItems = () => {
    this.props.courses.map(i => (this.state.opened[i.id] = false));
  };

  private handleClick = id => {
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
  const courseMap = (state[STATE_DATA] as DataState).courseMap;
  return {
    courses: [...courseMap.values()],
  };
};

export default connect(mapStateToProps)(CourseList);
