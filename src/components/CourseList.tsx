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
import { IExpandableListData } from '../types/sidebar';
import { COURSE_FUNC_LIST, COURSE_ICON } from '../constants/function';

class CourseList extends React.Component<
  IExpandableListData,
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
    const { name, icon, courses } = this.props;

    return (
      <List
        className={styles.course_list}
        component="nav"
        subheader={
          <ListSubheader component="div" disableSticky={true}>
            <FontAwesomeIcon icon={icon} />
            <span className={styles.list_title}>{name}</span>
          </ListSubheader>
        }
      >
        {courses.map(i => (
          <div key={i}>
            <ListItem
              className={styles.sidebar_list_item}
              button={true}
              onClick={() => this.handleClick(i)}
            >
              <ListItemIcon className={styles.list_item_icon}>
                <FontAwesomeIcon icon={COURSE_ICON} />
              </ListItemIcon>
              <ListItemText primary={i} className={styles.course_list_item_text} />
              <FontAwesomeIcon icon={this.state.opened[i] ? 'angle-up' : 'angle-down'} />
            </ListItem>
            <Collapse in={this.state.opened[i]} timeout="auto" unmountOnExit={true}>
              <List className={styles.subfunc_list} disablePadding={true}>
                {
                  COURSE_FUNC_LIST.map(func => (
                  <ListItem className={styles.sidebar_list_item} button={true} key={func.name}>
                    <ListItemIcon className={styles.list_item_icon}>
                      <FontAwesomeIcon icon={func.icon} />
                    </ListItemIcon>
                    <ListItemText primary={func.name} className={styles.course_list_item_text} />
                  </ListItem>
                ))
                    }
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    );
  }

  private closeAllItems = () => {
    this.props.courses.map(i => (this.state.opened[i] = false));
  };

  private handleClick = name => {
    const nextState = !this.state.opened[name];
    this.closeAllItems();
    this.setState({
      opened: { ...this.state.opened, [name]: nextState },
    });
  };
}

export default CourseList;
