import React from 'react';

import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SETTINGS_FUNC_LIST } from '../constants/ui';
import { useAppDispatch } from '../redux/hooks';

import styles from '../css/list.module.css';
import { Trans } from '@lingui/macro';

const SettingList = () => {
  const dispatch = useAppDispatch();

  return (
    <List
      className={styles.numbered_list}
      component="nav"
      subheader={
        <ListSubheader component="div" disableSticky>
          <FontAwesomeIcon icon="wrench" />
          <span className={styles.list_title}>
            <Trans>设置</Trans>
          </span>
        </ListSubheader>
      }
    >
      {SETTINGS_FUNC_LIST.map((i) => (
        <ListItemButton
          className={styles.sidebar_list_item}
          key={i.name}
          onClick={() => {
            i.handler?.(dispatch);
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
};

export default SettingList;
