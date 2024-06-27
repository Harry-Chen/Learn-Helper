import { useEffect, useMemo } from 'react';
import browser from 'webextension-polyfill';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  Badge,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';

import IconThumbtack from '~icons/fa6-solid/thumbtack';

import { SUMMARY_FUNC_LIST } from '../constants/ui';
import { refreshCardList, setCardFilter } from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import styles from '../css/list.module.css';
import { selectUnreadMap } from '../redux/selectors';

const SummaryList = () => {
  const { _ } = useLingui();
  const dispatch = useAppDispatch();

  const unreadMap = useAppSelector(selectUnreadMap);
  const unreadTotal = useMemo(
    () => Object.values(unreadMap).reduce((total, c) => total + c, 0),
    [unreadMap],
  );
  useEffect(
    () =>
      void browser.action.setBadgeText({ text: unreadTotal === 0 ? '' : unreadTotal.toString() }),
    [unreadTotal],
  );

  return (
    <List
      className={styles.numbered_list}
      component="nav"
      subheader={
        <ListSubheader component="div" disableSticky className={styles.list_title_header}>
          <IconThumbtack />
          <span className={styles.list_title}>
            <Trans>项目汇总</Trans>
          </span>
        </ListSubheader>
      }
    >
      {SUMMARY_FUNC_LIST.map((func) => (
        <ListItemButton
          className={styles.sidebar_list_item}
          key={func.name.id}
          onClick={() => {
            dispatch(setCardFilter({ type: func.type }));
            dispatch(refreshCardList());
          }}
        >
          <ListItemIcon className={styles.list_item_icon}>{func.icon}</ListItemIcon>
          <Badge
            badgeContent={func.type && unreadMap[func.type]}
            color="primary"
            invisible={!func.type || !unreadMap[func.type]}
          >
            <ListItemText className={styles.summary_list_item_text} primary={_(func.name)} />
          </Badge>
        </ListItemButton>
      ))}
    </List>
  );
};

export default SummaryList;
