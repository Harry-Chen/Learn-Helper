import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import styles from '../css/list.css';
import '../constants/fontAwesome.ts';
import { SettingListProps } from '../types/ui';
import { SETTINGS_FUNC_LIST } from '../constants/ui';

class SettingList extends React.PureComponent<SettingListProps, never> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <List
        className={styles.numbered_list}
        component="nav"
        subheader={
          <ListSubheader component="div" disableSticky>
            <FontAwesomeIcon icon="wrench" />
            <span className={styles.list_title}>设置</span>
          </ListSubheader>
        }
      >
        {SETTINGS_FUNC_LIST.map((i) => (
          <ListItem
            className={styles.sidebar_list_item}
            button
            key={i.name}
            onClick={() => {
              i.handler(this.props.dispatch);
            }}
          >
            <ListItemIcon className={styles.list_item_icon}>
              <FontAwesomeIcon icon={i.icon} />
            </ListItemIcon>
            <ListItemText primary={i.name} className={styles.settings_list_item_text} />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default connect()(SettingList);
