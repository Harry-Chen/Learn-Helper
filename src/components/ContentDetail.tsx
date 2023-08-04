import React from 'react';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';
import { ContentType, RemoteFile } from 'thu-learn-lib/lib/types';

import { Button, Paper } from '@mui/material';

import styles from '../css/page.module.css';
import { ContentDetailProps } from '../types/ui';
import { HomeworkInfo, NotificationInfo, FileInfo } from '../types/data';
import { addCSRFTokenToIframeUrl, formatDateTime } from '../utils/format';
import { setDetailUrl } from '../redux/actions/ui';
import { t } from '../utils/i18n';

const initialState = {
  frameUrl: undefined as string | undefined,
  loadPreview: false,
};

class ContentDetail extends React.PureComponent<ContentDetailProps, typeof initialState> {
  public state = initialState;

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
    if (contentDetail === undefined || contentDetail === '')
      contentDetail = t('Content_DetailEmpty');

    const fileToPreview: RemoteFile | undefined =
      (content as NotificationInfo | HomeworkInfo).attachment ?? (content as FileInfo).remoteFile;
    const showPreviewFrame = fileToPreview && this.canFilePreview(fileToPreview);

    // When `file.previewUrl` is changed (i.e file.previewUrl is not undefined and not equals to
    // this.state.frameUrl), do not set the <Iframe>'s `url` attribute immediately.
    // Instead, remove the IFrame label first, and set state `frameUrl` =`file.previewUrl`.
    // Thus, the component will be update later with correct state, to recreate the <IFrame>` label
    // rather than reuse the old one.
    // For file, its preview frame can be loaded instantly.
    // Otherwise (for homework & notification), user confirmation is required to save traffic.
    const deferPreviewLoad = showPreviewFrame && this.state?.frameUrl !== fileToPreview?.previewUrl;
    if (deferPreviewLoad) {
      setTimeout(
        () =>
          this.setState({
            frameUrl: fileToPreview.previewUrl,
            loadPreview: isFile,
          }),
        100,
      );
    }

    return (
      <section className={styles.content_detail}>
        <p className={styles.content_detail_title}>{content.title}</p>
        <section className={styles.content_detail_lines}>
          <table>
            <tbody>
              {this.generateLine(t('Content_CourseName'), content.courseName)}
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
        {showPreviewFrame && !this.state.loadPreview ? (
          <Button
            variant="outlined"
            onClick={() => {
              this.setState({ loadPreview: true });
            }}
          >
            {t('Content_LoadPreview', [fileToPreview!.size])}
          </Button>
        ) : null}
        {showPreviewFrame && this.state.loadPreview && !deferPreviewLoad ? (
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
    // black list for files that could not be previewed
    const BLACK_LIST = ['.exe', '.zip', '.rar', '.7z'];
    return !BLACK_LIST.some((suffix) => file.name.endsWith(suffix));
  };

  private generateFileLink = (
    downloadTitle: string,
    previewTitle: string,
    file?: RemoteFile,
  ): React.ReactNode => (
    <>
      {file
        ? this.generateLine(
            downloadTitle,
            this.generateLink(t('Content_File_Link', [file.name, file.size]), file.downloadUrl),
          )
        : null}
      {file && this.canFilePreview(file)
        ? this.generateLine(
            previewTitle,
            this.generateLink(t('Content_OpenInNewWindow'), file.previewUrl),
          )
        : null}
    </>
  );

  private generateDetailsForFile = (file: FileInfo): React.ReactNode => (
    <>
      {this.generateLine(t('Content_File_UploadedAt'), formatDateTime(file.uploadTime))}
      {this.generateLine(t('Content_File_VisitCount'), file.visitCount)}
      {this.generateLine(t('Content_File_DownloadCount'), file.downloadCount)}
      {this.generateLine(t('Content_File_Size'), file.size)}
      {this.generateLine(t('Content_File_Type'), this.translateFileType(file.fileType))}
      {this.generateFileLink(
        t('Content_File_Download'),
        t('Content_File_Preview'),
        file.remoteFile,
      )}
    </>
  );

  private generateDetailsForHomework = (homework: HomeworkInfo): React.ReactNode => (
    <>
      {this.generateLine(t('Content_Homework_Deadline'), formatDateTime(homework.deadline))}
      {homework.submitted
        ? this.generateLine(t('Content_Homework_SubmittedAt'), formatDateTime(homework.submitTime))
        : null}
      {homework.submittedContent !== undefined
        ? this.generateLine(
            t('Content_Homework_SubmissionContent'),
            homework.submittedContent,
            true,
          )
        : null}
      {this.generateFileLink(
        t('Content_Homework_SubmissionAttachment'),
        t('Content_Homework_SubmissionAttachmentPreview'),
        homework.submittedAttachment,
      )}
      {homework.graded
        ? this.generateLine(t('Content_Homework_GradedAt'), formatDateTime(homework.gradeTime))
        : null}
      {homework.graded
        ? this.generateLine(t('Content_Homework_Grader'), homework.graderName)
        : null}
      {homework.gradeLevel
        ? this.generateLine(t('Content_Homework_Grade'), homework.gradeLevel)
        : homework.graded
        ? this.generateLine(
            t('Content_Homework_Grade'),
            homework.grade ? homework.grade : t('Content_Homework_NoGrade'),
          )
        : null}
      {homework.gradeContent !== undefined
        ? this.generateLine(t('Content_Homework_GradeContent'), homework.gradeContent, true)
        : null}
      {this.generateFileLink(
        t('Content_Homework_GradeAttachment'),
        t('Content_Homework_GradeAttachmentPreview'),
        homework.gradeAttachment,
      )}
      {homework.answerContent !== undefined
        ? this.generateLine(t('Content_Homework_AnswerContent'), homework.answerContent, true)
        : null}
      {this.generateFileLink(
        t('Content_Homework_AnswerAttachment'),
        t('Content_Homework_AnswerAttachmentPreview'),
        homework.answerAttachment,
      )}
      {this.generateFileLink(
        t('Content_Homework_Attachment'),
        t('Content_Homework_AttachmentPreview'),
        homework.attachment,
      )}
      {this.generateLine(
        t('Content_Homework_Detail'),
        this.generateLink(t('Content_OpenInCurrentWindow'), homework.url, true),
      )}
    </>
  );

  private generateDetailsForNotification = (notification: NotificationInfo): React.ReactNode => (
    <>
      {this.generateLine(
        t('Content_Notification_PublishedAt'),
        formatDateTime(notification.publishTime),
      )}
      {this.generateLine(t('Content_Notification_Publisher'), notification.publisher)}
      {this.generateLine(
        t('Content_Notification_Severity'),
        notification.markedImportant
          ? t('Content_Notification_SeverityHigh')
          : t('Content_Notification_SeverityNormal'),
      )}
      {this.generateFileLink(
        t('Content_Notification_Attachment'),
        t('Content_Notification_AttachmentPreview'),
        notification.attachment,
      )}
      {this.generateLine(
        t('Content_Notification_Detail'),
        this.generateLink(t('Content_OpenInCurrentWindow'), notification.url, true),
      )}
    </>
  );

  private generateLine = (
    name: string,
    content: React.ReactNode,
    embedHtml = false,
  ): React.ReactNode => (
    <tr className={styles.content_detail_line}>
      <td>{name}</td>
      {embedHtml ? (
        <td dangerouslySetInnerHTML={{ __html: content as string }} />
      ) : (
        <td>{content}</td>
      )}
    </tr>
  );

  private generateLink = (name: string, url: string, inApp = false): React.ReactNode => {
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
      <a href={url} target="_blank" rel="noreferrer">
        {name}
      </a>
    );
  };
}

export default connect()(ContentDetail);
