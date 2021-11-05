import React from 'react';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';
import { ContentType, RemoteFile } from 'thu-learn-lib/lib/types';

import Paper from '@material-ui/core/Paper';

import styles from '../css/page.css';
import { ContentDetailProps } from '../types/ui';
import { HomeworkInfo, NotificationInfo, FileInfo } from '../types/data';
import { addCSRFTokenToIframeUrl, formatDateTime } from '../utils/format';
import { setDetailUrl } from '../redux/actions/ui';

class ContentDetail extends React.PureComponent<ContentDetailProps, { frameUrl?: string }> {
  public render() {
    const { content, csrfToken } = this.props;
    const homework = content as HomeworkInfo;
    const notification = content as NotificationInfo;
    const file = content as FileInfo;
    const isHomework = content.type === ContentType.HOMEWORK;
    const isNotification = content.type === ContentType.NOTIFICATION;
    const isFile = content.type === ContentType.FILE;

    let contentDetail = isHomework
      ? homework.description
      : isFile
      ? file.description
      : notification.content;
    if (contentDetail !== undefined) contentDetail = contentDetail.trim();
    if (contentDetail === undefined || contentDetail === '') contentDetail = '详情为空';

    let fileToPreview: RemoteFile | undefined =
      (content as any).attachment ?? (content as any).remoteFile;

    // When `file.previewUrl` is changed (i.e file.previewUrl is not undefined and not equals to
    // this.state.frameUrl), do not set the <Iframe>'s `url` attribute immediately.
    // Instead, remove the IFrame label first, and set state `frameUrl` =`file.previewUrl`.
    // Thus, the component will be update later with correct state, to recreate the <IFrame>` label
    // rather than reuse the old one.
    const shouldRemoveIframeFirst =
      fileToPreview?.previewUrl && this.state?.frameUrl !== fileToPreview?.previewUrl;
    if (shouldRemoveIframeFirst) {
      setTimeout(() => this.setState({ frameUrl: fileToPreview.previewUrl }), 100);
    }

    return (
      <section className={styles.content_detail}>
        <p className={styles.content_detail_title}>{content.title}</p>
        <section className={styles.content_detail_lines}>
          <table>
            <tbody>
              {this.generateLine('课程名称', content.courseName)}
              {isHomework ? this.generateDetailsForHomework(homework) : null}
              {isNotification ? this.generateDetailsForNotification(notification) : null}
              {isFile ? this.generateDetailsForFile(file) : null}
            </tbody>
          </table>
        </section>
        <Paper
          className={styles.content_detail_content}
          dangerouslySetInnerHTML={{ __html: contentDetail }}
        />
        {!shouldRemoveIframeFirst && fileToPreview && this.canFilePreview(fileToPreview) ? (
          <Iframe
            className={styles.content_detail_preview}
            url={addCSRFTokenToIframeUrl(csrfToken, this.state?.frameUrl)}
          />
        ) : null}
      </section>
    );
  }

  private translateFileType = (type: string): string =>
    // TODO: Translate file type to human-readable representation.
    type;

  private canFilePreview = (file: RemoteFile): boolean => {
    // TODO add type whitelist for preview
    const ALLOWED_TYPES = [];
    return file.previewUrl !== undefined;
  };

  private generateFileLink = (
    downloadTitle: string,
    previewTitle: string,
    file?: RemoteFile,
  ): React.ReactNode => (
    <>
      {file
        ? this.generateLine(downloadTitle, this.generateLink(file.name, file.downloadUrl))
        : null}
      {file && this.canFilePreview(file)
        ? this.generateLine(previewTitle, this.generateLink('在新窗口中打开', file.previewUrl))
        : null}
    </>
  );

  private generateDetailsForFile = (file: FileInfo): React.ReactNode => (
    <>
      {this.generateLine('上传时间', formatDateTime(file.uploadTime))}
      {this.generateLine('访问量', file.visitCount)}
      {this.generateLine('下载量', file.downloadCount)}
      {this.generateLine('文件大小', file.size)}
      {this.generateLine('文件类型', this.translateFileType(file.fileType))}
      {this.generateFileLink('文件下载', '文件预览', file.remoteFile)}
    </>
  );

  private generateDetailsForHomework = (homework: HomeworkInfo): React.ReactNode => (
    <>
      {this.generateLine('截止时间', formatDateTime(homework.deadline))}
      {homework.submitted
        ? this.generateLine('提交时间', formatDateTime(homework.submitTime))
        : null}
      {homework.submittedContent !== undefined
        ? this.generateLine('提交内容', homework.submittedContent, true)
        : null}
      {this.generateFileLink('提交附件', '提交附件预览', homework.submittedAttachment)}
      {homework.graded ? this.generateLine('评阅时间', formatDateTime(homework.gradeTime)) : null}
      {homework.graded ? this.generateLine('评阅者', homework.graderName) : null}
      {homework.gradeLevel
        ? this.generateLine('成绩', homework.gradeLevel)
        : homework.graded
        ? this.generateLine('成绩', homework.grade ? homework.grade : '无评分')
        : null}
      {homework.gradeContent !== undefined
        ? this.generateLine('评阅内容', homework.gradeContent, true)
        : null}
      {this.generateFileLink('评阅附件', '评阅附件预览', homework.gradeAttachment)}
      {homework.answerContent !== undefined
        ? this.generateLine('答案内容', homework.answerContent, true)
        : null}
      {this.generateFileLink('答案附件', '答案附件预览', homework.answerAttachment)}
      {this.generateLine('查看作业', this.generateLink(homework.title, homework.url, true))}
      {this.generateFileLink('作业附件', '作业附件预览', homework.attachment)}
    </>
  );

  private generateDetailsForNotification = (notification: NotificationInfo): React.ReactNode => (
    <>
      {this.generateLine('发布时间', formatDateTime(notification.publishTime))}
      {this.generateLine('发布人', notification.publisher)}
      {this.generateLine('重要性', notification.markedImportant ? '高' : '普通')}
      {this.generateFileLink('公告附件', '公告附件预览', notification.attachment)}
      {this.generateLine('公告原文', this.generateLink(notification.title, notification.url, true))}
    </>
  );

  private generateLine = (
    name: string,
    content: React.ReactNode,
    embedHtml: boolean = false,
  ): React.ReactNode => (
    <tr className={styles.content_detail_line}>
      <td>{name}：</td>
      {embedHtml ? (
        <td dangerouslySetInnerHTML={{ __html: content as string }} />
      ) : (
        <td>{content}</td>
      )}
    </tr>
  );

  private generateLink = (name: string, url: string, inApp: boolean = false): React.ReactNode => {
    if (inApp) {
      return (
        <a
          href={url}
          onClick={(ev) => {
            this.props.dispatch(setDetailUrl(url));
            ev.preventDefault();
          }}
        >
          {name}
        </a>
      );
    }
    return (
      <a href={url} target="_blank">
        {name}
      </a>
    );
  };
}

export default connect()(ContentDetail);
