import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/fontAwesome.ts';
import { SettingListProps } from '../types/sidebar';
import { connect } from 'react-redux';
import { SETTINGS_FUNC_LIST } from '../constants/function';

class SettingList extends React.Component<SettingListProps, null> {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <List
        className={styles.numbered_list}
        component="nav"
        subheader={
          <ListSubheader component="div" disableSticky={true}>
            <FontAwesomeIcon icon={'wrench'} />
            <span className={styles.list_title}>设置</span>
          </ListSubheader>
        }
      >
        {
          SETTINGS_FUNC_LIST.map(i => (
          <ListItem
            className={styles.sidebar_list_item}
            button={true}
            key={i.name}
            onClick={() => { i.handler(this.props.dispatch); }}
          >
            <ListItemIcon className={styles.list_item_icon}>
              <FontAwesomeIcon icon={i.icon} />
            </ListItemIcon>
              <ListItemText primary={i.name} className={styles.settings_list_item_text} />
          </ListItem>
        ))
            }
      </List>
    );
  }
}

export default connect()(SettingList);
