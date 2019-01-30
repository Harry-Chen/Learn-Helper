import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/FontAwesomeLibrary.ts';
import ListNumber from './ListNumber';
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
            subheader={<ListSubheader component="div">
              <FontAwesomeIcon icon={icon}/>
              <span className={styles.list_title}>{name}</span>
            </ListSubheader>}
        >
          {
            items.map(i => (
                <ListItem button={true} key={i.name}>
                  <ListItemIcon className={styles.list_icon}>
                    <FontAwesomeIcon icon={i.icon}/>
                  </ListItemIcon>
                  <ListItemText primary={i.name}/>
                  <ListNumber number={numbers[i.name]}/>
                </ListItem>
            ))
          }
        </List>
    );
  }
}

export default NumberedList;
