import React, { useState } from 'react';

import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { COURSE_FUNC, COURSE_FUNC_LIST, COURSE_ICON } from '../constants/ui';
import { refreshCardList, setCardFilter, setCardListTitle, setDetailUrl } from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCourseList } from '../redux/selectors';
import { t } from '../utils/i18n';

import styles from '../css/list.module.css';

const CourseList = () => {
  const dispatch = useAppDispatch();
  const courseList = useAppSelector(selectCourseList);

  const [opened, setOpened] = useState<string | undefined>();

  return (
    <List
      className={styles.course_list}
      component="nav"
      subheader={
        <ListSubheader component="div" disableSticky>
          <FontAwesomeIcon icon="inbox" />
          <span className={styles.list_title}>{t('CourseList_CurrentSemester')}</span>
        </ListSubheader>
      }
    >
      {courseList.length == 0 ? (
        <span className={styles.list_title}>{t('CourseList_Nothing')}</span>
      ) : (
        courseList.map((c) => (
          <div key={c.id}>
            <ListItemButton
              className={styles.sidebar_list_item}
              onClick={() => {
                setOpened(opened === c.id ? undefined : c.id);
              }}
            >
              <ListItemIcon className={styles.list_item_icon}>
                <FontAwesomeIcon icon={COURSE_ICON} />
              </ListItemIcon>
              <ListItemText primary={c.name} className={styles.course_list_item_text} />
              <FontAwesomeIcon icon={opened === c.id ? 'angle-up' : 'angle-down'} />
            </ListItemButton>
            <Collapse in={opened === c.id} timeout="auto" unmountOnExit>
              <List className={styles.subfunc_list} disablePadding>
                {COURSE_FUNC_LIST.map((func) => (
                  <ListItemButton
                    className={styles.sidebar_list_item}
                    key={func.name}
                    onClick={() => {
                      if (func.name !== COURSE_FUNC.COURSE_HOMEPAGE.name) {
                        // show cards
                        dispatch(setCardFilter({ type: func.type, courseId: c.id }));
                        dispatch(setCardListTitle(`${func.name}-${c.name}`));
                        dispatch(refreshCardList());
                      } else {
                        dispatch(setDetailUrl(c.url));
                      }
                    }}
                  >
                    <ListItemIcon className={styles.list_item_icon}>
                      <FontAwesomeIcon icon={func.icon} />
                    </ListItemIcon>
                    <ListItemText primary={func.name} className={styles.course_list_item_text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))
      )}
    </List>
  );
};

export default CourseList;
