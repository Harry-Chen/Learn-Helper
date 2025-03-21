import type { MessageDescriptor } from '@lingui/core';
import { msg, t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { Button, Paper } from '@mui/material';
import { type ReactNode, useState } from 'react';
import { ContentType, type RemoteFile } from 'thu-learn-lib';
import { useLocation } from 'wouter';

import styles from '../css/page.module.css';
import type { ContentInfo, FileInfo, HomeworkInfo, NotificationInfo } from '../types/data';
import {
  formatDateTime,
  formatHomeworkCompletionType,
  formatHomeworkGradeLevel,
  formatHomeworkSubmissionType,
  html2text,
} from '../utils/format';
import IframeWrapper from './IframeWrapper';

// const initialState = {
//   frameUrl: undefined as string | undefined,
//   loadPreview: false,
// };

interface LineProps {
  title: MessageDescriptor;
  children?: ReactNode;
  __html?: string;
}

const Line = ({ title, children, __html }: LineProps) => {
  const { _ } = useLingui();

  return (
    <tr className={styles.content_detail_line}>
      <td>{_(title)}</td>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: no reason */}
      {__html ? <td dangerouslySetInnerHTML={{ __html }} /> : <td>{children}</td>}
    </tr>
  );
};

interface LinkProps {
  url: string;
  inApp?: boolean;
  children: ReactNode;
}

const ContentLink = ({ url, inApp, children }: LinkProps) => {
  const [_location, navigate] = useLocation();

  if (inApp)
    return (
      // don't use <Link> here as we want to keep the behaviour of middle click to open in new tab
      <a
        href={url}
        onClick={(ev) => {
          navigate(`/web/${encodeURIComponent(url)}`);
          ev.preventDefault();
        }}
      >
        {children}
      </a>
    );

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
      <ContentLink url={file.downloadUrl}>
        <Trans>
          {file.name}（{file.size}）
        </Trans>
      </ContentLink>
    </Line>
    {canFilePreview(file) && (
      <Line title={previewTitle}>
        <ContentLink url={file.previewUrl}>
          <Trans>在新窗口打开</Trans>
        </ContentLink>
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
    {file.category && <Line title={msg`文件分类：`}>{file.category.title}</Line>}
    <FileLinks
      downloadTitle={msg`文件下载：`}
      previewTitle={msg`文件预览：`}
      file={file.remoteFile}
    />
  </>
);

const HomeworkDetails = ({ content: homework }: ContentDetailProps<HomeworkInfo>) => {
  const { _ } = useLingui();

  const submittedContent = html2text(homework.submittedContent ?? '');
  const answerContent = html2text(homework.answerContent ?? '');

  return (
    <>
      <Line title={msg`截止时间：`}>{formatDateTime(homework.deadline)}</Line>
      {homework.lateSubmissionDeadline && (
        <Line title={msg`补交截止时间：`}>{formatDateTime(homework.lateSubmissionDeadline)}</Line>
      )}
      <Line title={msg`完成方式：`}>
        {_(formatHomeworkCompletionType(homework.completionType))}
      </Line>
      <Line title={msg`提交方式：`}>
        {_(formatHomeworkSubmissionType(homework.submissionType))}
      </Line>
      {homework.submitted && (
        <Line title={homework.isLateSubmission ? msg`补交时间：` : msg`提交时间：`}>
          {formatDateTime(homework.submitTime)}
        </Line>
      )}
      {submittedContent && <Line title={msg`提交内容：`}>{submittedContent}</Line>}
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
            {homework.gradeLevel
              ? _(formatHomeworkGradeLevel(homework.gradeLevel))
              : (homework.grade ?? <Trans>无评分</Trans>)}
          </Line>
          <Line title={msg`评阅内容：`} __html={homework.gradeContent} />
          {homework.gradeAttachment && (
            <FileLinks
              downloadTitle={msg`评阅附件：`}
              previewTitle={msg`评阅附件预览：`}
              file={homework.gradeAttachment}
            />
          )}
        </>
      )}
      {answerContent && <Line title={msg`答案内容：`}>{answerContent}</Line>}
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
        <ContentLink url={homework.url} inApp>
          <Trans>在本窗口打开</Trans>
        </ContentLink>
      </Line>
    </>
  );
};

const NotificationDetails = ({ content: notification }: ContentDetailProps<NotificationInfo>) => (
  <>
    <Line title={msg`发布时间：`}>{formatDateTime(notification.publishTime)}</Line>
    {notification.expireTime && (
      <Line title={msg`过期时间：`}>{formatDateTime(notification.expireTime)}</Line>
    )}
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
        // biome-ignore lint/security/noDangerouslySetInnerHtml: no reason
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
