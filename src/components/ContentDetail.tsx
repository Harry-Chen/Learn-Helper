import React, { useState, type ReactNode } from 'react';
import { Button, Paper } from '@mui/material';
import { ContentType, type RemoteFile } from 'thu-learn-lib';
import { msg, Trans, t } from '@lingui/macro';
import type { MessageDescriptor } from '@lingui/core';
import { useLingui } from '@lingui/react';

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
  title: MessageDescriptor;
  children?: ReactNode;
}

const Line = ({ title, children }: LineProps) => {
  const { _ } = useLingui();

  return (
    <tr className={styles.content_detail_line}>
      <td>{_(title)}</td>
      <td>{children}</td>
    </tr>
  );
};

interface LinkProps {
  url: string;
  inApp?: boolean;
  children: ReactNode;
}

const Link = ({ url, inApp, children }: LinkProps) => {
  const dispatch = useAppDispatch();

  if (inApp)
    return (
      <a
        href={url}
        onClick={(ev) => {
          dispatch(setDetailUrl(url));
          ev.preventDefault();
        }}
      >
        {children}
      </a>
    );
  else
    return (
      <a href={url} target="_blank" rel="noreferrer">
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
  downloadTitle: MessageDescriptor;
  previewTitle: MessageDescriptor;
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
    <Line title={msg`上传时间：`}>{formatDateTime(file.uploadTime)}</Line>
    <Line title={msg`访问量：`}>{file.visitCount}</Line>
    <Line title={msg`下载量：`}>{file.downloadCount}</Line>
    <Line title={msg`文件大小：`}>{file.size}</Line>
    <Line title={msg`文件类型：`}>{translateFileType(file.type)}</Line>
    <FileLinks
      downloadTitle={msg`文件下载：`}
      previewTitle={msg`文件预览：`}
      file={file.remoteFile}
    />
  </>
);

const HomeworkDetails = ({ content: homework }: ContentDetailProps<HomeworkInfo>) => (
  <>
    <Line title={msg`截止时间：`}>{formatDateTime(homework.deadline)}</Line>
    {homework.submitted && (
      <Line title={msg`提交时间：`}>{formatDateTime(homework.submitTime)}</Line>
    )}
    {homework.submittedContent && (
      <Line title={msg`提交内容：`}>{renderHTML(homework.submittedContent)}</Line>
    )}
    {homework.submittedAttachment && (
      <FileLinks
        downloadTitle={msg`提交附件：`}
        previewTitle={msg`提交附件预览：`}
        file={homework.submittedAttachment}
      />
    )}
    {homework.graded && (
      <>
        <Line title={msg`评阅时间：`}>{formatDateTime(homework.gradeTime)}</Line>
        <Line title={msg`评阅者：`}>{homework.graderName}</Line>
        <Line title={msg`成绩：`}>
          {homework.gradeLevel ?? homework.grade ?? <Trans>无评分</Trans>}
        </Line>
        <Line title={msg`评阅内容：`}>{renderHTML(homework.gradeContent)}</Line>
        {homework.gradeAttachment && (
          <FileLinks
            downloadTitle={msg`评阅附件：`}
            previewTitle={msg`评阅附件预览：`}
            file={homework.gradeAttachment}
          />
        )}
      </>
    )}
    {homework.answerContent && (
      <Line title={msg`答案内容：`}>{renderHTML(homework.answerContent)}</Line>
    )}
    {homework.answerAttachment && (
      <FileLinks
        downloadTitle={msg`答案附件：`}
        previewTitle={msg`答案附件预览：`}
        file={homework.answerAttachment}
      />
    )}
    {homework.attachment && (
      <FileLinks
        downloadTitle={msg`作业附件：`}
        previewTitle={msg`作业附件预览：`}
        file={homework.attachment}
      />
    )}
    <Line title={msg`作业详情：`}>
      <Link url={homework.url} inApp>
        <Trans>在本窗口打开</Trans>
      </Link>
    </Line>
  </>
);

const NotificationDetails = ({ content: notification }: ContentDetailProps<NotificationInfo>) => (
  <>
    <Line title={msg`发布时间：`}>{formatDateTime(notification.publishTime)}</Line>
    <Line title={msg`发布人：`}>{notification.publisher}</Line>
    <Line title={msg`重要性：`}>
      {notification.markedImportant ? <Trans>高</Trans> : <Trans>普通</Trans>}
    </Line>
    {notification.attachment && (
      <FileLinks
        downloadTitle={msg`公告附件：`}
        previewTitle={msg`公告附件预览：`}
        file={notification.attachment}
      />
    )}
  </>
);

const ContentDetail = ({ content }: ContentDetailProps) => {
  const { _ } = useLingui();

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
            <Line title={msg`课程名称：`}>{_({ id: `course-${content.courseId}` })}</Line>
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
