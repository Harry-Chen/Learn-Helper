import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';

import cn from 'classnames';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import { CardListProps } from '../types/ui';
import ContentCard from './ContentCard';
import styles from '../css/list.css';

import { STATE_DATA, STATE_HELPER, STATE_UI } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { UiState } from '../redux/reducers/ui';
import { HelperState } from '../redux/reducers/helper';
import { loadMoreCard } from '../redux/actions/ui';
import { generateCardList } from '../redux/selectors';

const initialState = {
  onTop: true,
};

class CardList extends React.PureComponent<CardListProps, typeof initialState> {
  private readonly scrollRef: React.RefObject<HTMLDivElement>;

  public state = initialState;

  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  componentDidUpdate(prevProps: CardListProps) {
    if (prevProps.type !== this.props.type || prevProps.course !== this.props.course) {
      this.scrollRef.current.scrollTop = 0;
      this.setState({ onTop: true });
    }
  }

  public render() {
    const { contents, threshold, loadMore, ...rest } = this.props;
    const filtered = contents.slice(0, threshold);

    const canLoadMore = threshold < contents.length;

    return (
      <div
        className={styles.card_list}
        onScroll={ev => {
          const self = ev.target as HTMLDivElement;
          this.setState({ onTop: self.scrollTop === 0 });

          if (!canLoadMore) return;
          const bottomLine = self.scrollTop + self.clientHeight;
          if (bottomLine + 180 > self.scrollHeight)
            // 80 px on load more hint
            loadMore();
        }}
        ref={this.scrollRef}
        {...rest}
      >
        <List
          className={styles.card_list_inner}
          component="nav"
          subheader={
            <ListSubheader
              component="div"
              className={cn(styles.card_list_header, styles.card_list_header_floating)}
            />
          }
        >
          {filtered.map(c => (
            <ContentCard key={c.id} content={c} />
          ))}

          {filtered.length === 0 ? (
            <div className={styles.card_list_load_more}>这里什么也没有</div>
          ) : null}

          {canLoadMore ? (
            <div className={styles.card_list_load_more} onClick={loadMore}>
              加载更多
            </div>
          ) : null}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state): Partial<CardListProps> => {
  const data = state[STATE_DATA] as DataState;
  const ui = state[STATE_UI] as UiState;
  const loggedIn = (state[STATE_HELPER] as HelperState).loggedIn;

  if (!loggedIn) {
    return {
      contents: [],
      title: '加载中...',
    };
  }

  return {
    type: ui.cardTypeFilter,
    course: ui.cardCourseFilter,
    ...generateCardList(
      data,
      data.lastUpdateTime,
      ui.cardTypeFilter,
      ui.cardCourseFilter,
      ui.titleFilter,
    ),
    title: ui.cardListTitle,
    threshold: ui.cardVisibilityThreshold,
  };
};

const mapDispatchToProps = (dispatch): Partial<CardListProps> => {
  return {
    loadMore: () => {
      dispatch(loadMoreCard());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardList);
