import { useState } from 'react';
import { useLocation } from 'wouter';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';

import IconInbox from '~icons/fa6-solid/inbox';
import IconBook from '~icons/fa6-solid/book';
import IconAngleUp from '~icons/fa6-solid/angle-up';
import IconAngleDown from '~icons/fa6-solid/angle-down';

import { COURSE_FUNC_LIST } from '../constants/ui';
import { refreshCardList, setCardFilter } from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCourseList } from '../redux/selectors';

import styles from '../css/list.module.css';

const CourseList = () => {
  const { _ } = useLingui();
  const [_location, navigate] = useLocation();
  const dispatch = useAppDispatch();
  const courseList = useAppSelector(selectCourseList);

  const [opened, setOpened] = useState<string | undefined>();

  return (
    <List
      className={styles.course_list}
      component="nav"
      subheader={
        <ListSubheader component="div" disableSticky className={styles.list_title_header}>
          <IconInbox />
          <span className={styles.list_title}>
            <Trans>本学期课程</Trans>
          </span>
        </ListSubheader>
      }
    >
      {courseList.length == 0 ? (
        <span className={styles.list_title}>
          <Trans>这里什么也没有，快去选点课吧！</Trans>
        </span>
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
                <IconBook />
              </ListItemIcon>
              <ListItemText
                primary={_({ id: `course-${c.id}` })}
                className={styles.course_list_item_text}
              />
              {opened === c.id ? <IconAngleUp /> : <IconAngleDown />}
            </ListItemButton>
            <Collapse in={opened === c.id} timeout="auto" unmountOnExit>
              <List className={styles.subfunc_list} disablePadding>
                {COURSE_FUNC_LIST.map((func) => (
                  <ListItemButton
                    className={styles.sidebar_list_item}
                    key={func.name.id}
                    onClick={() => {
                      if (func.type !== 'homepage') {
                        // show cards
                        dispatch(setCardFilter({ type: func.type, courseId: c.id }));
                        dispatch(refreshCardList());
                      } else {
                        navigate(`/web/${encodeURIComponent(c.url)}`);
                      }
                    }}
                  >
                    <ListItemIcon className={styles.list_item_icon}>{func.icon}</ListItemIcon>
                    <ListItemText primary={_(func.name)} className={styles.course_list_item_text} />
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
