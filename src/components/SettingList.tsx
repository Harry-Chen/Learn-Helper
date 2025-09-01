import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { useLocation } from 'wouter';

import IconWrench from '~icons/fa6-solid/wrench';

import { SETTINGS_FUNC_LIST } from '../constants/ui';
import styles from '../css/list.module.css';
import { useAppDispatch } from '../redux/hooks';

const SettingList = () => {
  const { _ } = useLingui();
  const [_location, navigate] = useLocation();
  const dispatch = useAppDispatch();

  return (
    <List
      className={styles.numbered_list}
      component="nav"
      subheader={
        <ListSubheader component="div" disableSticky className={styles.list_title_header}>
          <IconWrench />
          <span className={styles.list_title}>
            <Trans>设置</Trans>
          </span>
        </ListSubheader>
      }
    >
      {SETTINGS_FUNC_LIST.map((i) => (
        <ListItemButton
          className={styles.sidebar_list_item}
          key={i.name.id}
          onClick={() => {
            i.handler?.(dispatch, navigate);
          }}
        >
          <ListItemIcon className={styles.list_item_icon}>{i.icon}</ListItemIcon>
          <ListItemText primary={_(i.name)} className={styles.settings_list_item_text} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default SettingList;
