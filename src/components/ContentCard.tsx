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

import IconCheck from '~icons/fa6-solid/check';
import IconStar from '~icons/fa6-solid/star';
import IconClipboard from '~icons/fa6-solid/clipboard';
import IconClipboardCheck from '~icons/fa6-solid/clipboard-check';
import IconTrash from '~icons/fa6-solid/trash';
import IconTrashCan from '~icons/fa6-solid/trash-can';
import IconUpload from '~icons/fa6-solid/upload';
import IconDownload from '~icons/fa6-solid/download';
import IconPaperclip from '~icons/fa6-solid/paperclip';

import styles from '../css/card.module.css';
import { COURSE_MAIN_FUNC } from '../constants/ui';
import {
  toggleReadState,
  toggleIgnoreState,
  toggleStarState,
  setDetailContent,
  setDetailUrl,
} from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { formatDate, formatHomeworkGradeLevel } from '../utils/format';
import { initiateFileDownload } from '../utils/download';

interface ContentCardProps {
  type: ContentType;
  id: string;
}

const ContentCard = ({ type, id }: ContentCardProps) => {
  const { _ } = useLingui();
  const dispatch = useAppDispatch();

  const content = useAppSelector((state) => state.data[`${type}Map`][id]);

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
                    {content.type === ContentType.HOMEWORK && content.submitted ? (
                      <IconCheck />
                    ) : (
                      COURSE_MAIN_FUNC[content.type].icon
                    )}
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
                          ? _(formatHomeworkGradeLevel(content.gradeLevel))
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
              size="small"
            >
              <IconStar />
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
              size="small"
            >
              {content.hasRead ? <IconClipboard /> : <IconClipboardCheck />}
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
              size="small"
            >
              {content.ignored ? <IconTrash /> : <IconTrashCan />}
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
                size="small"
              >
                <IconUpload />
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
                size="small"
              >
                <IconDownload />
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
                  size="small"
                >
                  <IconPaperclip />
                </IconButton>
              </Tooltip>
            )}
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default ContentCard;
