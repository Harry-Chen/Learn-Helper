import React, { useState, type ReactNode } from 'react';
import { Button, Paper } from '@mui/material';
import { ContentType, type RemoteFile } from 'thu-learn-lib';
import { Trans, t } from '@lingui/macro';

import type { HomeworkInfo, NotificationInfo, FileInfo, ContentInfo } from '../types/data';
import { formatDateTime } from '../utils/format';
import { useAppDispatch } from '../redux/hooks';
import { setDetailUrl } from '../redux/actions';
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
  children: ReactNode;
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
      <Link url={file.downloadUrl}>
        <Trans>
          {file.name}（{file.size}）
        </Trans>
      </Link>
    </Line>
    {canFilePreview(file) && (
      <Line title={previewTitle}>
        <Link url={file.previewUrl}>
          <Trans>在新窗口打开</Trans>
        </Link>
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
    <Line title={t`上传时间：`}>{formatDateTime(file.uploadTime)}</Line>
    <Line title={t`访问量：`}>{file.visitCount}</Line>
    <Line title={t`下载量：`}>{file.downloadCount}</Line>
    <Line title={t`文件大小：`}>{file.size}</Line>
    <Line title={t`文件类型：`}>{translateFileType(file.type)}</Line>
    <FileLinks downloadTitle={t`文件下载：`} previewTitle={t`文件预览：`} file={file.remoteFile} />
  </>
);

const HomeworkDetails = ({ content: homework }: ContentDetailProps<HomeworkInfo>) => (
  <>
    <Line title={t`截止时间：`}>{formatDateTime(homework.deadline)}</Line>
    {homework.submitted && <Line title={t`提交时间：`}>{formatDateTime(homework.submitTime)}</Line>}
    {homework.submittedContent && (
      <Line title={t`提交内容：`}>{renderHTML(homework.submittedContent)}</Line>
    )}
    {homework.submittedAttachment && (
      <FileLinks
        downloadTitle={t`提交附件：`}
        previewTitle={t`提交附件预览：`}
        file={homework.submittedAttachment}
      />
    )}
    {homework.graded && (
      <>
        <Line title={t`评阅时间：`}>{formatDateTime(homework.gradeTime)}</Line>
        <Line title={t`评阅者：`}>{homework.graderName}</Line>
        <Line title={t`成绩：`}>
          {homework.gradeLevel ?? homework.grade ?? <Trans>无评分</Trans>}
        </Line>
        <Line title={t`评阅内容：`}>{renderHTML(homework.gradeContent)}</Line>
        {homework.gradeAttachment && (
          <FileLinks
            downloadTitle={t`评阅附件：`}
            previewTitle={t`评阅附件预览：`}
            file={homework.gradeAttachment}
          />
        )}
      </>
    )}
    {homework.answerContent && (
      <Line title={t`答案内容：`}>{renderHTML(homework.answerContent)}</Line>
    )}
    {homework.answerAttachment && (
      <FileLinks
        downloadTitle={t`答案附件：`}
        previewTitle={t`答案附件预览：`}
        file={homework.answerAttachment}
      />
    )}
    {homework.attachment && (
      <FileLinks
        downloadTitle={t`作业附件：`}
        previewTitle={t`作业附件预览：`}
        file={homework.attachment}
      />
    )}
    <Line title={t`作业详情：`}>
      <Link url={homework.url} inApp={true}>
        <Trans>在本窗口打开</Trans>
      </Link>
    </Line>
  </>
);

const NotificationDetails = ({ content: notification }: ContentDetailProps<NotificationInfo>) => (
  <>
    <Line title={t`发布时间`}>{formatDateTime(notification.publishTime)}</Line>
    <Line title={t`发布人`}>{notification.publisher}</Line>
    <Line title={t`重要性`}>
      {notification.markedImportant ? <Trans>高</Trans> : <Trans>普通</Trans>}
    </Line>
    {notification.attachment && (
      <FileLinks
        downloadTitle={t`公告附件`}
        previewTitle={t`公告附件预览`}
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
    )?.trim() || t`详情为空`;

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
            <Line title={t`课程名称`}>{content.courseName}</Line>
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
          <Trans>加载预览（{fileToPreview!.size}）</Trans>
        </Button>
      )}
      {showPreviewFrame && preview && (
        <IframeWrapper className={styles.content_detail_preview} url={fileToPreview.previewUrl} />
      )}
    </section>
  );
};

export default ContentDetail;
