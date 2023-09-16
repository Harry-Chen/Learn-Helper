import React, { useEffect, useMemo } from 'react';
import browser from 'webextension-polyfill';
import { Trans } from '@lingui/macro';

import {
  Badge,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SUMMARY_FUNC_LIST } from '../constants/ui';
import { refreshCardList, setCardFilter, setCardListTitle } from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import styles from '../css/list.module.css';
import { selectUnreadMap } from '../redux/selectors';

const SummaryList = () => {
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
        <ListSubheader component="div" disableSticky>
          <FontAwesomeIcon icon="thumbtack" />
          <span className={styles.list_title}>
            <Trans>项目汇总</Trans>
          </span>
        </ListSubheader>
      }
    >
      {SUMMARY_FUNC_LIST.map((func) => (
        <ListItemButton
          className={styles.sidebar_list_item}
          key={func.name}
          onClick={() => {
            dispatch(setCardFilter({ type: func.type }));
            dispatch(setCardListTitle(func.name));
            dispatch(refreshCardList());
          }}
        >
          <ListItemIcon className={styles.list_item_icon}>
            <FontAwesomeIcon icon={func.icon} />
          </ListItemIcon>
          <Badge
            badgeContent={func.type && unreadMap[func.type]}
            color="primary"
            invisible={!func.type || !unreadMap[func.type]}
          >
            <ListItemText className={styles.summary_list_item_text} primary={func.name} />
          </Badge>
        </ListItemButton>
      ))}
    </List>
  );
};

export default SummaryList;
