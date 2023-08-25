import React, { useState, type ReactNode } from 'react';
import { ContentType, type RemoteFile } from 'thu-learn-lib/lib/types';

import { Button, Paper } from '@mui/material';

import type { HomeworkInfo, NotificationInfo, FileInfo, ContentInfo } from '../types/data';
import { formatDateTime } from '../utils/format';
import { useAppDispatch } from '../redux/hooks';
import { setDetailUrl } from '../redux/actions';
import { t } from '../utils/i18n';
import { renderHTML } from '../utils/html';
import styles from '../css/page.module.css';
import IframeWrapper from './IframeWrapper';

// const initialState = {
//   frameUrl: undefined as string | undefined,
//   loadPreview: false,
// };

interface LineProps {
  title: string;
  children?: ReactNode;
}

const Line = ({ title, children }: LineProps) => (
  <tr className={styles.content_detail_line}>
    <td>{title}</td>
    <td>{children}</td>
  </tr>
);

interface LinkProps {
  url: string;
  inApp?: boolean;
  children: string;
}

const Link = ({ url, inApp, children }: LinkProps) => {
  const dispatch = useAppDispatch();

  return (
    <a
      href={url}
      onClick={(ev) => {
        if (inApp) {
          dispatch(setDetailUrl(url));
          ev.preventDefault();
        }
      }}
    >
      {children}
    </a>
  );
};

const canFilePreview = (file: RemoteFile): boolean => {
  // black list for files that could not be previewed
  const BLACK_LIST = ['.exe', '.zip', '.rar', '.7z'];
  return !BLACK_LIST.some((suffix) => file.name.endsWith(suffix));
};

interface FileLinkProps {
  downloadTitle: string;
  previewTitle: string;
  file: RemoteFile;
}

const FileLinks = ({ downloadTitle, previewTitle, file }: FileLinkProps) => (
  <>
    <Line title={downloadTitle}>
      <Link url={file.downloadUrl}>{t('Content_File_Link', [file.name, file.size])}</Link>
    </Line>
    {canFilePreview(file) && (
      <Line title={previewTitle}>
        <Link url={file.previewUrl}>{t('Content_OpenInNewWindow')}</Link>
      </Line>
    )}
  </>
);

const translateFileType = (type: string): string =>
  // TODO: Translate file type to human-readable representation.
  type;

interface ContentDetailProps<T extends ContentInfo = ContentInfo> {
  content: T;
}

const FileDetails = ({ content: file }: ContentDetailProps<FileInfo>) => (
  <>
    <Line title={t('Content_File_UploadedAt')}>{formatDateTime(file.uploadTime)}</Line>
    <Line title={t('Content_File_VisitCount')}>{file.visitCount}</Line>
    <Line title={t('Content_File_DownloadCount')}>{file.downloadCount}</Line>
    <Line title={t('Content_File_Size')}>{file.size}</Line>
    <Line title={t('Content_File_Type')}>{translateFileType(file.type)}</Line>
    <FileLinks
      downloadTitle={t('Content_File_Download')}
      previewTitle={t('Content_File_Preview')}
      file={file.remoteFile}
    />
  </>
);

const HomeworkDetails = ({ content: homework }: ContentDetailProps<HomeworkInfo>) => (
  <>
    <Line title={t('Content_Homework_Deadline')}>{formatDateTime(homework.deadline)}</Line>
    {homework.submitted && (
      <Line title={t('Content_Homework_SubmittedAt')}>{formatDateTime(homework.submitTime)}</Line>
    )}
    {homework.submittedContent && (
      <Line title={t('Content_Homework_SubmissionContent')}>
        {renderHTML(homework.submittedContent)}
      </Line>
    )}
    {homework.submittedAttachment && (
      <FileLinks
        downloadTitle={t('Content_Homework_SubmissionAttachment')}
        previewTitle={t('Content_Homework_SubmissionAttachmentPreview')}
        file={homework.submittedAttachment}
      />
    )}
    {homework.graded && (
      <>
        <Line title={t('Content_Homework_GradedAt')}>{formatDateTime(homework.gradeTime)}</Line>
        <Line title={t('Content_Homework_Grader')}>{homework.graderName}</Line>
        <Line title={t('Content_Homework_Grade')}>
          {homework.gradeLevel ?? homework.grade ?? t('Content_Homework_NoGrade')}
        </Line>
        <Line title={t('Content_Homework_GradeContent')}>{renderHTML(homework.gradeContent)}</Line>
        {homework.gradeAttachment && (
          <FileLinks
            downloadTitle={t('Content_Homework_GradeAttachment')}
            previewTitle={t('Content_Homework_GradeAttachmentPreview')}
            file={homework.gradeAttachment}
          />
        )}
      </>
    )}
    {homework.answerContent && (
      <Line title={t('Content_Homework_AnswerContent')}>{renderHTML(homework.answerContent)}</Line>
    )}
    {homework.answerAttachment && (
      <FileLinks
        downloadTitle={t('Content_Homework_AnswerAttachment')}
        previewTitle={t('Content_Homework_AnswerAttachmentPreview')}
        file={homework.answerAttachment}
      />
    )}
    {homework.attachment && (
      <FileLinks
        downloadTitle={t('Content_Homework_Attachment')}
        previewTitle={t('Content_Homework_AttachmentPreview')}
        file={homework.attachment}
      />
    )}
    <Line title={t('Content_Homework_Detail')}>
      <Link url={homework.url} inApp={true}>
        {t('Content_OpenInCurrentWindow')}
      </Link>
    </Line>
  </>
);

const NotificationDetails = ({ content: notification }: ContentDetailProps<NotificationInfo>) => (
  <>
    <Line title={t('Content_Notification_PublishedAt')}>
      {formatDateTime(notification.publishTime)}
    </Line>
    <Line title={t('Content_Notification_Publisher')}>{notification.publisher}</Line>
    <Line title={t('Content_Notification_Severity')}>
      {notification.markedImportant
        ? t('Content_Notification_SeverityHigh')
        : t('Content_Notification_SeverityNormal')}
    </Line>
    {notification.attachment && (
      <FileLinks
        downloadTitle={t('Content_Notification_Attachment')}
        previewTitle={t('Content_Notification_AttachmentPreview')}
        file={notification.attachment}
      />
    )}
  </>
);

const ContentDetail = ({ content }: ContentDetailProps) => {
  const contentDetail =
    (content.type === ContentType.HOMEWORK
      ? content.description
      : content.type === ContentType.FILE
      ? content.description
      : content.type === ContentType.NOTIFICATION
      ? content.content
      : undefined
    )?.trim() || t('Content_DetailEmpty');

  const fileToPreview: RemoteFile | undefined =
    (content as NotificationInfo | HomeworkInfo).attachment ?? (content as FileInfo).remoteFile;
  const showPreviewFrame = fileToPreview && canFilePreview(fileToPreview);

  const [preview, setPreview] = useState(content.type === ContentType.FILE);

  return (
    <section className={styles.content_detail}>
      <p className={styles.content_detail_title}>{content.title}</p>
      <section className={styles.content_detail_lines}>
        <table>
          <tbody>
            <Line title={t('Content_CourseName')}>{content.courseName}</Line>
            {content.type === ContentType.FILE && <FileDetails content={content} />}
            {content.type === ContentType.HOMEWORK && <HomeworkDetails content={content} />}
            {content.type === ContentType.NOTIFICATION && <NotificationDetails content={content} />}
          </tbody>
        </table>
      </section>
      <Paper
        className={styles.content_detail_content}
        dangerouslySetInnerHTML={{ __html: contentDetail }}
      />
      {showPreviewFrame && !preview && (
        <Button variant="outlined" onClick={() => setPreview(true)}>
          {t('Content_LoadPreview', [fileToPreview!.size])}
        </Button>
      )}
      {showPreviewFrame && preview && (
        <IframeWrapper className={styles.content_detail_preview} url={fileToPreview.previewUrl} />
      )}
    </section>
  );
};

export default ContentDetail;
