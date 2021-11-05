import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { ContentType, RemoteFile } from 'thu-learn-lib/lib/types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../css/card.css';
import { formatDate } from '../utils/format';
import { DiscussionInfo, FileInfo, HomeworkInfo, NotificationInfo } from '../types/data';
import { CardProps } from '../types/ui';
import { COURSE_MAIN_FUNC } from '../constants/ui';
import { toggleReadState, toggleIgnoreState, toggleStarState } from '../redux/actions/data';
import { setDetailContent, setDetailUrl } from '../redux/actions/ui';
import { initiateFileDownload } from '../utils/download';

class ContentCard extends React.PureComponent<CardProps, never> {
  public render(): React.ReactNode {
    const { content } = this.props;

    return (
      <Card className={styles.detail_card}>
        <CardActionArea onClick={this.onTitleClick}>
          <CardContent>
            <div className={styles.card_first_line}>
              {this.iconArea()}
              <span className={styles.card_title}>{content.title}</span>
            </div>

            <div className={styles.card_second_line}>
              <span className={styles.card_status}>{this.genStatusText()}</span>
              <span className={styles.card_course}>{content.courseName}</span>
            </div>
          </CardContent>
          {this.actionArea()}
        </CardActionArea>
      </Card>
    );
  }

  private onTitleClick = () => {
    const { content } = this.props;
    switch (content.type) {
      // show details in DetailPane
      case ContentType.FILE:
      case ContentType.NOTIFICATION:
      case ContentType.HOMEWORK:
        this.props.dispatch(setDetailContent(content));
        break;
      // navigate iframe in DetailPane to given url
      case ContentType.DISCUSSION:
      case ContentType.QUESTION:
        const { url } = content as DiscussionInfo;
        this.props.dispatch(setDetailUrl(url));
    }
    // mark card as read
    this.props.dispatch(toggleReadState(content.id, true, content.type));
  };

  private generateHomeworkGradeStatus = (homework: HomeworkInfo) => {
    if (!homework.graded) {
      return '未批阅';
    }
    let grade = '';
    if (homework.grade === undefined) {
      grade = '无评分';
    } else {
      grade = homework.gradeLevel ? homework.gradeLevel : `${homework.grade}分`;
    }
    grade += `（${homework.graderName}）`;
    return grade;
  };

  private genStatusText() {
    const { content } = this.props;

    let suffix = '';

    if (content.type === ContentType.HOMEWORK) {
      const homework = content as HomeworkInfo;
      const submitted = homework.submitted ? '已提交' : '未提交';
      const grade = this.generateHomeworkGradeStatus(homework);
      suffix = ` · ${submitted} · ${grade}`;
    } else if (content.type === ContentType.NOTIFICATION || content.type === ContentType.FILE) {
      const notification = content as NotificationInfo;
      if (notification.markedImportant) {
        suffix += ' · 重要';
      }
      if (content.type === ContentType.NOTIFICATION) {
        suffix += ` · 发布者:${notification.publisher}`;
      } else if (content.type === ContentType.FILE) {
        const file = content as FileInfo;
        suffix += ` · ${file.size}`;
        if (file.description.trim() !== '') {
          suffix += ` · ${file.description.trim()}`;
        }
      }
    } else if (content.type === ContentType.DISCUSSION || content.type === ContentType.QUESTION) {
      const discussion = content as DiscussionInfo;
      suffix = ` · 回复:${discussion.replyCount}`;
      if (discussion.replyCount !== 0) {
        suffix += ` · 最后回复:${discussion.lastReplierName}`;
      }
    }

    return `${formatDate(content.date)}${suffix}`;
  }

  private iconArea() {
    const { content } = this.props;

    let iconName = COURSE_MAIN_FUNC[content.type].icon;

    if (content.type === ContentType.HOMEWORK) {
      const homework = content as HomeworkInfo;
      if (homework.submitted) iconName = 'check';
    }

    const icon = (
      <Avatar className={styles.card_func_icon}>
        <FontAwesomeIcon icon={iconName} />
      </Avatar>
    );

    let label: string;
    let className: string;
    if (content.type === ContentType.HOMEWORK) {
      const homework = content as HomeworkInfo;
      const timeDiff = homework.date.getTime() - new Date().getTime();
      const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
      if (diffDays > 99) {
        label = '99+';
      } else if (diffDays < 0) {
        label = COURSE_MAIN_FUNC[content.type].name;
      } else {
        label = String(diffDays);
      }

      let urgency: string;
      if (diffDays >= 0 && homework.submitted) {
        urgency = 'submitted';
      } else if (diffDays >= 10) {
        urgency = 'far';
      } else if (diffDays >= 5) {
        urgency = 'near';
      } else if (diffDays >= 3) {
        urgency = 'close';
      } else if (diffDays >= 0) {
        urgency = 'urgent';
      } else {
        urgency = 'due';
      }
      className = `chip_${content.type}_${urgency}`;
    } else {
      label = COURSE_MAIN_FUNC[content.type].name;
      className = `chip_${content.type}`;
    }

    return (
      <Badge variant="dot" color="secondary" invisible={content.hasRead}>
        <Chip
          avatar={icon}
          label={<div className={styles.card_chip_text}>{label}</div>}
          className={classnames(styles[className], styles.card_func_chip)}
        />
      </Badge>
    );
  }

  private actionArea() {
    const { content, dispatch } = this.props;

    const starButton = (
      <Tooltip title={content.starred ? '取消星标' : '加星标'}>
        <IconButton
          color="primary"
          className={classnames(styles.card_action_button, {
            [styles.card_starred]: content.starred,
          })}
          component="div"
          onClick={(ev) => {
            dispatch(toggleStarState(content.id, !content.starred, content.type));
            ev.stopPropagation();
          }}
          onMouseDown={(ev) => ev.stopPropagation()}
        >
          <FontAwesomeIcon icon="star" />
        </IconButton>
      </Tooltip>
    );

    const markReadButton = (
      <Tooltip title={content.hasRead ? '标记为未读' : '标记为已读'}>
        <IconButton
          color="primary"
          className={styles.card_action_button}
          component="div"
          onClick={(ev) => {
            dispatch(toggleReadState(content.id, !content.hasRead, content.type));
            ev.stopPropagation();
          }}
          onMouseDown={(ev) => ev.stopPropagation()}
        >
          <FontAwesomeIcon icon={content.hasRead ? 'clipboard' : 'clipboard-check'} />
        </IconButton>
      </Tooltip>
    );

    const ignoreButton = (
      <Tooltip title={content.ignored ? '取消忽略此项' : '忽略此项'}>
        <IconButton
          color="primary"
          className={styles.card_action_button}
          component="div"
          onClick={(ev) => {
            dispatch(toggleIgnoreState(content.id, !content.ignored, content.type));
            ev.stopPropagation();
          }}
          onMouseDown={(ev) => ev.stopPropagation()}
        >
          <FontAwesomeIcon icon={content.ignored ? 'trash' : 'trash-alt'} />
        </IconButton>
      </Tooltip>
    );

    let submitButton: ReactNode = null;
    let attachmentButton: ReactNode = null;
    let downloadButton: ReactNode = null;
    if (content.type === ContentType.HOMEWORK) {
      const homework = content as HomeworkInfo;
      submitButton = (
        <Tooltip title="提交作业">
          <IconButton
            color="primary"
            className={styles.card_action_button}
            component="div"
            onClick={(ev) => {
              dispatch(setDetailUrl(homework.submitUrl));
              ev.stopPropagation();
            }}
            onMouseDown={(ev) => ev.stopPropagation()}
          >
            <FontAwesomeIcon icon="upload" />
          </IconButton>
        </Tooltip>
      );
    }

    if ((content as any).attachment) {
      // could be homework or notification, anyway it has attachmentName and attachmentUrl
      const f = (content as any).attachment as RemoteFile;
      attachmentButton = (
        <Tooltip title={`附件：${f.name}`}>
          <IconButton
            color="primary"
            className={styles.card_action_button}
            component="div"
            onClick={() => {
              initiateFileDownload(f.downloadUrl, f.name);
            }}
          >
            <FontAwesomeIcon icon="paperclip" />
          </IconButton>
        </Tooltip>
      );
    }
    if (content.type === ContentType.FILE) {
      const file = content as FileInfo;
      downloadButton = (
        <Tooltip title="下载文件">
          <IconButton
            color="primary"
            className={styles.card_action_button}
            component="div"
            onClick={() => {
              initiateFileDownload(file.remoteFile.downloadUrl);
            }}
          >
            <FontAwesomeIcon icon="download" />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <CardActions className={styles.card_action_line}>
        {starButton}
        {markReadButton}
        {ignoreButton}
        {submitButton}
        {downloadButton}
        {attachmentButton}
      </CardActions>
    );
  }
}

export default connect()(ContentCard);
