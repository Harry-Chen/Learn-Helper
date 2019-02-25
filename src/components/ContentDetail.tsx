import React from 'react';
import { connect } from 'react-redux';
import { ContentType } from 'thu-learn-lib/lib/types';

import Paper from '@material-ui/core/Paper';

import styles from '../css/page.css';
import { ContentDetailProps } from '../types/ui';
import { HomeworkInfo, NotificationInfo, FileInfo } from '../types/data';
import { formatDate } from '../utils/format';
import { setDetailUrl } from '../redux/actions/ui';

class ContentDetail extends React.PureComponent<ContentDetailProps, never> {
  public render() {
    const content = this.props.content;
    const homework = content as HomeworkInfo;
    const notification = content as NotificationInfo;
    const file = content as FileInfo;
    const isHomework = content.type === ContentType.HOMEWORK;
    const isNotification = content.type === ContentType.NOTIFICATION;
    const isFile = content.type === ContentType.FILE;
    return (
      <div className={styles.content_detail}>
        <p className={styles.content_detail_title}>{content.title}</p>
        <div className={styles.content_detail_lines}>
          <table>
            <tbody>
              {this.generateLine('课程名称', content.courseName)}
              {isHomework ? this.generateDetailsForHomework(homework) : null}
              {isNotification ? this.generateDetailsForNotification(notification) : null}
              {isFile ? this.generateDetailsForFile(file) : null}
            </tbody>
          </table>
        </div>
        <Paper
          className={styles.content_detail_content}
          dangerouslySetInnerHTML={{
            __html: isHomework
              ? homework.description
              : isFile
              ? file.description
              : notification.content,
          }}
        />
      </div>
    );
  }
  private translateFileType = (type: String): String => {
    //TODO: Translate file type to human-readable representation.
    return type;
  };
  private;
  private generateDetailsForFile = (file: FileInfo): React.ReactNode => {
    return (
      <>
        {this.generateLine('上传时间', formatDate(file.uploadTime))}
        {this.generateLine('访问量', file.visitCount)}
        {this.generateLine('下载量', file.downloadCount)}
        {this.generateLine('文件类型', this.translateFileType(file.fileType))}
        {this.generateLine('操作', this.generateLink('下载', file.downloadUrl))}
      </>
    );
  };
  private generateDetailsForHomework = (homework: HomeworkInfo): React.ReactNode => {
    return (
      <>
        {this.generateLine('截止日期', formatDate(homework.deadline))}
        {homework.submitted ? this.generateLine('提交时间', formatDate(homework.submitTime)) : null}
        {homework.submittedContent !== undefined
          ? this.generateLine('提交内容', homework.submittedContent, true)
          : null}
        {homework.submittedAttachmentName !== undefined
          ? this.generateLine(
              '提交附件',
              this.generateLink(homework.submittedAttachmentName, homework.submittedAttachmentUrl),
            )
          : null}
        {homework.graded ? this.generateLine('评阅时间', formatDate(homework.gradeTime)) : null}
        {homework.graded ? this.generateLine('评阅者', homework.graderName) : null}
        {homework.graded ? this.generateLine('成绩', homework.grade) : null}
        {homework.gradeContent !== undefined
          ? this.generateLine('评阅内容', homework.gradeContent, true)
          : null}
        {homework.gradeAttachmentName !== undefined
          ? this.generateLine(
              '评阅附件',
              this.generateLink(homework.gradeAttachmentName, homework.gradeAttachmentUrl),
            )
          : null}
        {homework.answerContent !== undefined
          ? this.generateLine('答案内容', homework.answerContent, true)
          : null}
        {homework.answerAttachmentName !== undefined
          ? this.generateLine(
              '答案附件',
              this.generateLink(homework.answerAttachmentName, homework.answerAttachmentUrl),
            )
          : null}
        {this.generateLine('作业详情', this.generateLink(homework.title, homework.url, true))}
      </>
    );
  };
  private generateDetailsForNotification = (notification: NotificationInfo): React.ReactNode => {
    return (
      <>
        {this.generateLine('发布日期', formatDate(notification.publishTime))}
        {this.generateLine('发布人', notification.publisher)}
        {this.generateLine('重要性', notification.markedImportant ? '高' : '普通')}
        {notification.attachmentName !== undefined
          ? this.generateLine(
              '公告附件',
              this.generateLink(notification.attachmentName, notification.attachmentUrl),
            )
          : null}
        {this.generateLine(
          '公告详情',
          this.generateLink(notification.title, notification.url, true),
        )}
      </>
    );
  };

  private generateLine = (
    name: string,
    content: React.ReactNode,
    embedHtml: boolean = false,
  ): React.ReactNode => {
    return (
      <tr className={styles.content_detail_line}>
        <td>{name}：</td>
        {embedHtml ? (
          <td dangerouslySetInnerHTML={{ __html: content as string }} />
        ) : (
          <td>{content}</td>
        )}
      </tr>
    );
  };

  private generateLink = (name: string, url: string, inApp: boolean = false): React.ReactNode => {
    if (inApp) {
      return (
        <a
          href={url}
          onClick={ev => {
            this.props.dispatch(setDetailUrl(url));
            ev.preventDefault();
          }}
        >
          {name}
        </a>
      );
    } else {
      return <a href={url}>{name}</a>;
    }
  };
}

export default connect()(ContentDetail);
