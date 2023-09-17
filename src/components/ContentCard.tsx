import React from 'react';
import classnames from 'classnames';
import { ContentType } from 'thu-learn-lib';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  IconButton,
  Chip,
  Badge,
  Avatar,
  Tooltip,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../css/card.module.css';
import type { CardProps } from '../types/ui';
import { COURSE_MAIN_FUNC } from '../constants/ui';
import {
  toggleReadState,
  toggleIgnoreState,
  toggleStarState,
  setDetailContent,
  setDetailUrl,
} from '../redux/actions';
import { useAppDispatch } from '../redux/hooks';
import { formatDate } from '../utils/format';
import { initiateFileDownload } from '../utils/download';

const ContentCard = ({ content }: CardProps) => {
  const { _ } = useLingui();
  const dispatch = useAppDispatch();

  const onTitleClick = () => {
    switch (content.type) {
      // show details in DetailPane
      case ContentType.FILE:
      case ContentType.NOTIFICATION:
      case ContentType.HOMEWORK:
        dispatch(setDetailContent(content));
        break;
      // navigate iframe in DetailPane to given url
      case ContentType.DISCUSSION:
      case ContentType.QUESTION:
        dispatch(setDetailUrl(content.url));
    }
    // mark card as read
    dispatch(toggleReadState({ type: content.type, id: content.id, state: true }));
  };

  const diffDays = Math.floor((content.date.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <Card className={styles.detail_card}>
      <CardActionArea onClick={onTitleClick}>
        <CardContent>
          <div className={styles.card_first_line}>
            <Badge variant="dot" color="secondary" invisible={content.hasRead}>
              <Chip
                avatar={
                  <Avatar className={styles.card_func_icon}>
                    <FontAwesomeIcon
                      icon={
                        content.type === ContentType.HOMEWORK && content.submitted
                          ? 'check'
                          : COURSE_MAIN_FUNC[content.type].icon
                      }
                    />
                  </Avatar>
                }
                label={
                  <div className={styles.card_chip_text}>
                    {content.type === ContentType.HOMEWORK
                      ? diffDays > 99
                        ? '99+'
                        : diffDays < 0
                        ? _(COURSE_MAIN_FUNC[content.type].name)
                        : diffDays.toString()
                      : _(COURSE_MAIN_FUNC[content.type].name)}
                  </div>
                }
                className={classnames(
                  styles[
                    content.type === ContentType.HOMEWORK
                      ? `chip_homework_${
                          diffDays < 0
                            ? 'due'
                            : content.submitted
                            ? 'submitted'
                            : diffDays >= 10
                            ? 'far'
                            : diffDays >= 5
                            ? 'near'
                            : diffDays >= 3
                            ? 'close'
                            : 'urgent'
                        }`
                      : `chip_${content.type}`
                  ],
                  styles.card_func_chip,
                )}
              />
            </Badge>
            <span className={styles.card_title}>{content.title}</span>
          </div>

          <div className={styles.card_second_line}>
            <span className={styles.card_status}>
              {formatDate(content.date)}
              {content.type === ContentType.HOMEWORK
                ? ' · ' +
                  (content.submitted ? t`已提交` : t`未提交`) +
                  ' · ' +
                  (content.graded
                    ? (content.grade
                        ? content.gradeLevel
                          ? content.gradeLevel
                          : t`${content.grade}分`
                        : t`无评分`) + t`（${content.graderName ?? ''}）`
                    : t`未批阅`)
                : content.type === ContentType.NOTIFICATION || content.type === ContentType.FILE
                ? (content.markedImportant ? ' · ' + t`重要` : '') +
                  (content.type === ContentType.NOTIFICATION
                    ? ' · ' + t`发布者:${content.publisher}`
                    : ' · ' +
                      content.size +
                      (content.description.trim() !== '' ? ' · ' + content.description.trim() : ''))
                : content.type === ContentType.DISCUSSION || content.type === ContentType.QUESTION
                ? ' · ' +
                  t`回复:${content.replyCount}` +
                  (content.replyCount !== 0 ? ' · ' + t`最后回复:${content.lastReplierName}` : '')
                : null}
            </span>
            <span className={styles.card_course}>{_({ id: `course-${content.courseId}` })}</span>
          </div>
        </CardContent>
        <CardActions className={styles.card_action_line}>
          <Tooltip title={content.starred ? t`取消星标` : t`加星标`}>
            <IconButton
              color="primary"
              className={classnames(styles.card_action_button, {
                [styles.card_starred]: content.starred,
              })}
              component="div"
              onClick={(ev) => {
                dispatch(
                  toggleStarState({ type: content.type, id: content.id, state: !content.starred }),
                );
                ev.stopPropagation();
              }}
              onMouseDown={(ev) => ev.stopPropagation()}
              size="large"
            >
              <FontAwesomeIcon icon="star" />
            </IconButton>
          </Tooltip>
          <Tooltip title={content.hasRead ? t`标记为未读` : t`标记为已读`}>
            <IconButton
              color="primary"
              className={styles.card_action_button}
              component="div"
              onClick={(ev) => {
                dispatch(
                  toggleReadState({ type: content.type, id: content.id, state: !content.hasRead }),
                );
                ev.stopPropagation();
              }}
              onMouseDown={(ev) => ev.stopPropagation()}
              size="large"
            >
              <FontAwesomeIcon icon={content.hasRead ? 'clipboard' : 'clipboard-check'} />
            </IconButton>
          </Tooltip>
          <Tooltip title={content.ignored ? t`取消忽略此项` : t`忽略此项`}>
            <IconButton
              color="primary"
              className={styles.card_action_button}
              component="div"
              onClick={(ev) => {
                dispatch(
                  toggleIgnoreState({
                    type: content.type,
                    id: content.id,
                    state: !content.ignored,
                  }),
                );
                ev.stopPropagation();
              }}
              onMouseDown={(ev) => ev.stopPropagation()}
              size="large"
            >
              <FontAwesomeIcon icon={content.ignored ? 'trash' : 'trash-alt'} />
            </IconButton>
          </Tooltip>
          {content.type === ContentType.HOMEWORK && (
            <Tooltip title={t`提交作业`}>
              <IconButton
                color="primary"
                className={styles.card_action_button}
                component="div"
                onClick={(ev) => {
                  dispatch(setDetailUrl(content.submitUrl));
                  ev.stopPropagation();
                }}
                onMouseDown={(ev) => ev.stopPropagation()}
                size="large"
              >
                <FontAwesomeIcon icon="upload" />
              </IconButton>
            </Tooltip>
          )}
          {content.type === ContentType.FILE && (
            <Tooltip title={t`下载文件`}>
              <IconButton
                color="primary"
                className={styles.card_action_button}
                component="div"
                onClick={() => {
                  initiateFileDownload(content.remoteFile.downloadUrl);
                }}
                size="large"
              >
                <FontAwesomeIcon icon="download" />
              </IconButton>
            </Tooltip>
          )}
          {(content.type === ContentType.NOTIFICATION || content.type === ContentType.HOMEWORK) &&
            content.attachment && (
              <Tooltip title={t`附件：${content.attachment.name}`}>
                <IconButton
                  color="primary"
                  className={styles.card_action_button}
                  component="div"
                  onClick={() => {
                    if (content.attachment)
                      initiateFileDownload(content.attachment.downloadUrl, content.attachment.name);
                  }}
                  size="large"
                >
                  <FontAwesomeIcon icon="paperclip" />
                </IconButton>
              </Tooltip>
            )}
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default ContentCard;
