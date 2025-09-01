import { Trans } from '@lingui/react/macro';
import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import cn from 'classnames';
import { memoize } from 'proxy-memoize';
import { useEffect, useRef, useState } from 'react';
import { ContentType } from 'thu-learn-lib';
import styles from '../css/list.module.css';
import { downloadAllUnreadFiles, loadMoreCard } from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ContentCard from './ContentCard';

const CardList = () => {
  const dispatch = useAppDispatch();
  const threshold = useAppSelector((state) => state.ui.cardVisibilityThreshold);
  const originalCardList = useAppSelector((state) => state.ui.cardList);

  const [_onTop, setOnTop] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void originalCardList;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setOnTop(true);
    }
  }, [originalCardList]);

  const cards = useAppSelector(
    memoize((state) =>
      state.helper.loggedIn
        ? originalCardList
            .map(({ type, id }) => state.data[`${type}Map`][id])
            .filter(
              (c) =>
                !!c &&
                c.title
                  .toLocaleLowerCase()
                  .includes(state.ui.titleFilter?.toLocaleLowerCase() ?? ''),
            )
        : [],
    ),
  );
  const filtered = cards.slice(0, threshold);
  const unreadFileCount = cards.reduce((count, c) => {
    if (c.type === ContentType.FILE && !c.hasRead) return count + 1;
    return count;
  }, 0);
  const canLoadMore = threshold < cards.length;

  return (
    <div
      className={styles.card_list}
      onScroll={(ev) => {
        const self = ev.target as HTMLDivElement;
        setOnTop(self.scrollTop === 0);

        if (!canLoadMore) return;
        const bottomLine = self.scrollTop + self.clientHeight;
        if (bottomLine + 180 > self.scrollHeight) {
          // 80 px on load more hint
          dispatch(loadMoreCard());
        }
      }}
      ref={scrollRef}
    >
      <List className={styles.card_list_inner} component="nav" subheader={<div />}>
        {unreadFileCount !== 0 && (
          <ListSubheader
            component="div"
            className={cn(styles.card_list_header, styles.card_list_header_floating)}
          >
            <ListItemButton
              onClick={() => {
                dispatch(downloadAllUnreadFiles(cards));
              }}
            >
              <ListItemText sx={{ textAlign: 'center' }}>
                <Trans>下载所有未读文件（共 {unreadFileCount?.toString()} 个）</Trans>
              </ListItemText>
            </ListItemButton>
          </ListSubheader>
        )}

        {filtered.map((c) => (
          <ContentCard key={`${c.type}-${c.id}`} type={c.type} id={c.id} />
        ))}

        {filtered.length === 0 && (
          <ListItem disablePadding>
            <ListItemText sx={{ textAlign: 'center', opacity: 0.6 }}>
              <Trans>这里什么也没有</Trans>
            </ListItemText>
          </ListItem>
        )}

        {canLoadMore && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => dispatch(loadMoreCard())}>
              <ListItemText sx={{ textAlign: 'center' }}>
                <Trans>加载更多</Trans>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default CardList;
