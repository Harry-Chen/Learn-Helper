import React from 'react';
import { connect } from 'react-redux';
import { action as browserAction } from 'webextension-polyfill';

import {
  Badge,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../css/list.module.css';
import '../constants/fontAwesome';
import { SummaryListProps } from '../types/ui';
import { STATE_DATA, STATE_HELPER } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { COURSE_MAIN_FUNC, SUMMARY_FUNC_LIST } from '../constants/ui';
import { ContentInfo, HomeworkInfo } from '../types/data';
import { HelperState } from '../redux/reducers/helper';
import { setCardFilter, setCardListTitle } from '../redux/actions/ui';
import { t } from '../utils/i18n';

class SummaryList extends React.PureComponent<SummaryListProps, never> {
  render() {
    const { numbers, dispatch } = this.props;

    return (
      <List
        className={styles.numbered_list}
        component="nav"
        subheader={
          <ListSubheader component="div" disableSticky>
            <FontAwesomeIcon icon="thumbtack" />
            <span className={styles.list_title}>{t('Summary')}</span>
          </ListSubheader>
        }
      >
        {SUMMARY_FUNC_LIST.map((func) => (
          <ListItemButton
            className={styles.sidebar_list_item}
            key={func.name}
            onClick={() => {
              dispatch(setCardFilter(func.type));
              dispatch(setCardListTitle(func.name));
            }}
          >
            <ListItemIcon className={styles.list_item_icon}>
              <FontAwesomeIcon icon={func.icon} />
            </ListItemIcon>
            <Badge
              badgeContent={numbers[func.type]}
              color="primary"
              invisible={func.type === undefined || numbers[func.type] === undefined}
            >
              <ListItemText className={styles.summary_list_item_text} primary={func.name} />
            </Badge>
          </ListItemButton>
        ))}
      </List>
    );
  }
}

const mapStateToProps = (state): SummaryListProps => {
  const helper = state[STATE_HELPER] as HelperState;
  if (!helper.loggedIn) return { numbers: {} };
  const data = state[STATE_DATA] as DataState;
  const numbers = {};
  let total = 0;
  for (const func of Object.values(COURSE_MAIN_FUNC)) {
    const { type } = func;
    const mapName = `${type}Map`;
    const map = data[mapName] as Map<string, ContentInfo>;
    let count = 0;
    for (const [, c] of map.entries()) {
      if (
        !c.ignored &&
        data.contentIgnore[c.courseId]?.[type] === false &&
        (!c.hasRead || // all unread content
          // unfinished homework before deadline
          (!(c as HomeworkInfo).submitted &&
            (c as HomeworkInfo)?.deadline?.getTime() > new Date().getTime()))
      ) {
        count += 1;
      }
    }
    numbers[type] = count;
    total += count;
  }
  browserAction.setBadgeText({ text: total === 0 ? '' : String(total) });
  return { numbers };
};

export default connect(mapStateToProps)(SummaryList);
