import React from 'react';
import classnames from 'classnames';

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

import { loadMoreCard } from '../redux/actions/ui';

class CardList extends React.Component<CardListProps, null> {
  public render() {
    const { contents, threshold, title, loadMore } = this.props;
    const filtered = contents.slice(0, threshold);

    const canLoadMore = threshold < contents.length;

    return (
      <div
        className={styles.card_list}
        onScroll={ev => {
          if(!canLoadMore) return;
          const self = ev.target;
          const bottomline = self.scrollTop + self.clientHeight;
          if(bottomline + 180 > self.scrollHeight) // 80 px on load more hint
            loadMore();
        }}
      >
        <List
          className={styles.card_list_inner}
          component="nav"
          subheader={
            <ListSubheader component="div" className={styles.card_list_header}>
              <span className={styles.card_list_header_text}>{title}</span>
            </ListSubheader>
          }
        >
          {
            filtered.map(c => <DetailCard
              key={c.id}
              content={c}
            />)
          }

          { canLoadMore ? <div className={styles.card_list_load_more} onClick={loadMore}>
            加载更多
          </div> : null }
        </List>
      </div>
    );
  }
}

let oldType: ContentType;
let oldCourse: CourseInfo;
let allContent: ContentInfo[];
let oldCards: ContentInfo[];
let lastRegenerateTime: Date;

const generateCardList = (data: DataState, lastUpdateTime: Date,
                          type?: ContentType, course?: CourseInfo):
  Partial<CardListProps> => {

  let newCards: ContentInfo[] = [];

  if (type === oldType && course === oldCourse
    && oldCards !== undefined && lastRegenerateTime === lastUpdateTime) {
    // filter and data not changed, use filtered & sorted sequence
    // just fetch the latest state
    newCards = oldCards.map(l => data[`${l.type}Map`].get(l.id));
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

    // fetch latest state of data
    newCards = allContent
      .map(l => data[`${l.type}Map`].get(l.id));
    if(type !== undefined)
      newCards = newCards.filter(l => l.type === type);
    if(course !== undefined)
      newCards = newCards.filter(l => l.courseId === course.id);

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
  return {
    contents: newCards,
  };
};

const mapStateToProps = (state): Partial<CardListProps> => {
  const data = (state[STATE_DATA] as DataState);
  const ui = (state[STATE_UI] as UiState);
  const loggedIn = (state[STATE_HELPER] as HelperState).loggedIn;

  if (!loggedIn) {
    return {
      contents: [],
      title: '未登录',
    };
  }

  return {
    ...generateCardList(data, data.lastUpdateTime, ui.cardTypeFilter, ui.cardCourseFilter),
    title: ui.cardListTitle,
    threshold: ui.cardVisibilityThreshold,
  };

};

const mapDispatchToProps = dispatch => ({
  loadMore: () => dispatch(loadMoreCard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
