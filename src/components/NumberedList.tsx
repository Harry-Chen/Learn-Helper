import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/FontAwesomeLibrary.ts';
import { INumberedListData } from '../types/SideBar';

class NumberedList extends React.Component<INumberedListData, null> {
  constructor(props) {
    super(props);
  }

  render() {
    const { name, icon, items, numbers } = this.props;

    return (
      <List
        className={styles.numbered_list}
        component="nav"
        subheader={
          <ListSubheader component="div" disableSticky={true}>
            <FontAwesomeIcon icon={icon} />
            <span className={styles.list_title}>{name}</span>
          </ListSubheader>
        }
      >
        {items.map(i => (
          <ListItem className={styles.sidebar_list_item} button={true} key={i.name}>
            <ListItemIcon className={styles.list_item_icon}>
              <FontAwesomeIcon icon={i.icon} />
            </ListItemIcon>
            <Badge
              badgeContent={numbers[i.type]}
              color="primary"
              invisible={i.type === undefined || numbers[i.type] === undefined}
            >
              <ListItemText primary={i.name} />
            </Badge>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default NumberedList;
