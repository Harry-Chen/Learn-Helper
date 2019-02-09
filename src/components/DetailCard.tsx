import React, { ReactNode } from 'react';
import classnames from 'classnames';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { COURSE_MAIN_FUNC_LIST } from '../constants/SideBarItems';
import { CardData, CardType } from '../types/SideBar';

import styles from '../css/sidebar.css';

class DetailCard extends React.Component<
  {
    card: CardData;
  },
  null
> {
  public render(): React.ReactNode {
    const { card } = this.props;

    return (
      <Card className={styles.detail_card}>
        <CardContent>
          <div className={styles.card_first_line}>
            {this.iconArea()}
            <span className={styles.card_title}>{card.title}</span>
          </div>

          <div className={styles.card_second_line}>
            <span className={styles.card_status}>{this.genStatusText()}</span>
            <span className={styles.card_course}>{card.course}</span>
          </div>
        </CardContent>
        {this.actionArea()}
      </Card>
    );
  }

  private genStatusText() {
    const { card } = this.props;
    const date = `${card.date.getFullYear()}-${card.date.getMonth() + 1}-${card.date.getDay()}`;

    if (card.type === CardType.HOMEWORK) {
      const submitted = card.hasSubmitted ? '已提交' : '未提交';
      const grade = card.grade === undefined ? '未批阅' : `成绩：${card.grade}`;
      return `${date} - ${submitted} - ${grade}`;
    }

    return `${date}`;
  }

  private iconArea() {
    const { card } = this.props;

    const icon = (
      <Avatar className={styles.card_func_icon}>
        <FontAwesomeIcon icon={COURSE_MAIN_FUNC_LIST[card.type].icon} />
      </Avatar>
    );

    let label: string;
    let className: string;
    if (card.type === CardType.HOMEWORK) {
      const timeDiff = Math.abs(card.date.getTime() - new Date().getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays > 99) {
        label = '99+';
      } else {
        label = String(diffDays);
      }

      let urgency: string;
      if (card.hasSubmitted) {
        urgency = 'SUBMITTED';
      } else if (diffDays > 10) {
        urgency = 'FAR';
      } else if (diffDays > 5) {
        urgency = 'NEAR';
      } else if (diffDays > 3) {
        urgency = 'CLOSE';
      } else if (diffDays >= 0) {
        urgency = 'URGENT';
      } else {
        urgency = 'DUE';
      }
      className = `chip_HOMEWORK_${urgency}`;
    } else {
      label = COURSE_MAIN_FUNC_LIST[card.type].name;
      className = `chip_${card.type}`;
    }

    return (
      <Badge variant="dot" color="secondary" invisible={card.hasRead}>
        <Chip
          avatar={icon}
          label={<span className={styles.card_chip_text}>{label}</span>}
          className={classnames(styles[className], styles.card_func_chip)}
        />
      </Badge>
    );
  }

  private actionArea() {
    const { card } = this.props;

    const starButton = (
      <Tooltip title={card.hasStarred ? '取消星标' : '加星标'}>
        <IconButton
          color="primary"
          className={classnames(styles.card_action_button, { [styles.card_starred]: card.hasStarred })}
          component="div"
        >
          <FontAwesomeIcon icon="star" />
        </IconButton>
      </Tooltip>
    );

    const markReadButton = card.hasRead ? null : (
      <Tooltip title="标记为已读">
        <IconButton color="primary" className={styles.card_action_button} component="div">
          <FontAwesomeIcon icon="check" />
        </IconButton>
      </Tooltip>
    );

    let submitButton: ReactNode = null;
    let fileButton: ReactNode = null;

    if (card.type === CardType.HOMEWORK) {
      submitButton = (
        <Tooltip title="提交作业">
          <IconButton color="primary" className={styles.card_action_button} component="div">
            <FontAwesomeIcon icon="upload" />
          </IconButton>
        </Tooltip>
      );
      if (card.fileLink !== undefined) {
        fileButton = (
          <Tooltip title="下载作业附件">
            <IconButton color="primary" className={styles.card_action_button} component="div">
              <FontAwesomeIcon icon="paperclip" />
            </IconButton>
          </Tooltip>
        );
      }
    }

    const action = (
      <CardActions className={styles.card_action_line}>
        {starButton}
        {markReadButton}
        {submitButton}
        {fileButton}
      </CardActions>
    );

    return action;
  }
}

export default DetailCard;
