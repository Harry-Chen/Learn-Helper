import type {
  ContentType,
  Discussion,
  File,
  Homework,
  Notification,
  Question,
} from 'thu-learn-lib';

interface ICourseRef {
  courseId: string;
}

interface ICardStatus {
  type: ContentType;
  id: string;
  date: Date;
  hasRead: boolean;
  starred: boolean;
  ignored: boolean;
}

type ICardData = ICourseRef & ICardStatus;

export interface NotificationInfo extends Notification, ICardData {
  type: ContentType.NOTIFICATION;
}
export interface HomeworkInfo extends Homework, ICardData {
  type: ContentType.HOMEWORK;
}
export interface FileInfo extends File, ICardData {
  type: ContentType.FILE;
}
export interface DiscussionInfo extends Discussion, ICardData {
  type: ContentType.DISCUSSION;
}
export interface QuestionInfo extends Question, ICardData {
  type: ContentType.QUESTION;
}

export type ContentInfo =
  | NotificationInfo
  | HomeworkInfo
  | FileInfo
  | DiscussionInfo
  | QuestionInfo;

export type SupportedContentType = Exclude<ContentType, ContentType.QUESTIONNAIRE>;
