import React from 'react';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/fontAwesome.ts';
import { CardListProps } from '../types/sidebar';
import DetailCard from './DetailCard';
import { connect } from 'react-redux';
import { STATE_DATA, STATE_HELPER, STATE_UI } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { UiState } from '../redux/reducers/ui';
import { HelperState } from '../redux/reducers/helper';
import { ContentInfo } from '../types/data';
import { ContentType, CourseInfo } from 'thu-learn-lib/lib/types';

class CardList extends React.Component<CardListProps, null> {
  public render() {
    const { contents, visibility, title } = this.props;

    return (
      <List
        component="nav"
        subheader={
          <ListSubheader component="div" className={styles.card_list_header}>
            <span className={styles.card_list_header_text}>{title}</span>
          </ListSubheader>
        }
      >
        {
          contents.map(c => (
          <DetailCard
            content={c}
            key={c.id}
            hidden={!visibility[c.id]}
          />
        ))
          }
      </List>
    );
  }
}

let oldType: ContentType;
let oldCourse: CourseInfo;
let allContent: ContentInfo[];
let oldCards: ContentInfo[];
let oldVisibility: {};
let lastRegenerateTime: Date;

const generateCardList = (data: DataState, lastUpdateTime: Date,
                          type?: ContentType, course?: CourseInfo):
  Partial<CardListProps> => {

  const newCards: ContentInfo[] = [];
  let visibility: {};

  if (type === oldType && course === oldCourse
    && oldCards !== undefined && lastRegenerateTime === lastUpdateTime) {
    // filter and data not changed, use filtered & sorted sequence
    // just fetch the latest state
    for (const l of oldCards) {
      newCards.push(data[`${l.type}Map`].get(l.id));
    }
    visibility = oldVisibility;
  } else {
    // filter or data changed, re-calculate visibility and sequence

    if (lastUpdateTime !== lastRegenerateTime) {
      // data updated from network, generate data from scratch
      allContent = [];
      for (const k of Object.keys(data)) {
        if (k.startsWith('course') || !k.endsWith('Map')) continue;
        const source = data[k] as Map<string, ContentInfo>;
        for (const item of source.values()) {
          allContent.push(item);
        }
      }
      lastRegenerateTime = lastUpdateTime;
    }

    // clear visibility
    visibility = {};

    // fetch latest state of data
    for (const l of allContent) {
      newCards.push(data[`${l.type}Map`].get(l.id));
    }

    // calculate visibility
    for (const l of newCards) {
      visibility[l.id] = (type === undefined || l.type === type)
        && (course === undefined || l.courseId === course.id);
    }

    // sort by starred, hasRead and time
    newCards.sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      if (!a.hasRead && b.hasRead) return -1;
      if (a.hasRead && !b.hasRead) return 1;
      return b.date.getTime() - a.date.getTime();
    });

  }

  oldType = type;
  oldCourse = course;
  oldCards = newCards;
  oldVisibility = visibility;
  return {
    contents: newCards,
    visibility,
  };
};

const mapStateToProps = (state): Partial<CardListProps> => {
  const data = (state[STATE_DATA] as DataState);
  const ui = (state[STATE_UI] as UiState);
  const loggedIn = (state[STATE_HELPER] as HelperState).loggedIn;

  if (!loggedIn) {
    return {
      contents: [],
      visibility: {},
      title: '未登录',
    };
  }

  return {
    ...generateCardList(data, data.lastUpdateTime, ui.cardTypeFilter, ui.cardCourseFilter),
    title: ui.cardListTitle,
  };

};

export default connect(mapStateToProps)(CardList);
