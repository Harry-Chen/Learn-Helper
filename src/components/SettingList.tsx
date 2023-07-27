import React from 'react';
import { connect } from 'react-redux';

import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../css/list.module.css';
import '../constants/fontAwesome';
import { SettingListProps } from '../types/ui';
import { SETTINGS_FUNC_LIST } from '../constants/ui';
import { t } from '../utils/i18n';

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
            <span className={styles.list_title}>{t('Settings')}</span>
          </ListSubheader>
        }
      >
        {SETTINGS_FUNC_LIST.map((i) => (
          <ListItemButton
            className={styles.sidebar_list_item}
            key={i.name}
            onClick={() => {
              i.handler(this.props.dispatch);
            }}
          >
            <ListItemIcon className={styles.list_item_icon}>
              <FontAwesomeIcon icon={i.icon} />
            </ListItemIcon>
            <ListItemText primary={i.name} className={styles.settings_list_item_text} />
          </ListItemButton>
        ))}
      </List>
    );
  }
}

export default connect()(SettingList);
