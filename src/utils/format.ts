import { type MessageDescriptor, i18n } from '@lingui/core';
import { msg, t } from '@lingui/core/macro';
import { FailReason, HomeworkGradeLevel, type SemesterInfo, SemesterType } from 'thu-learn-lib';

export const semesterName = {
  [SemesterType.FALL]: msg`秋季学期`,
  [SemesterType.SPRING]: msg`春季学期`,
  [SemesterType.SUMMER]: msg`夏季学期`,
};

export function formatSemester(semester: SemesterInfo): string {
  if (semester.type !== SemesterType.UNKNOWN) {
    return `${semester.startYear}-${semester.endYear}-${i18n._(semesterName[semester.type])}`;
  }
  return SemesterType.UNKNOWN;
}

export function semesterFromId(id: string): SemesterInfo {
  let type = SemesterType.UNKNOWN;
  switch (id.charAt(id.length - 1)) {
    case '1':
      type = SemesterType.FALL;
      break;
    case '2':
      type = SemesterType.SPRING;
      break;
    case '3':
      type = SemesterType.SUMMER;
      break;
  }
  return {
    id,
    startDate: new Date(),
    endDate: new Date(),
    startYear: Number.parseInt(id.substring(0, 4)),
    endYear: Number.parseInt(id.substring(5, 9)),
    type,
  };
}

export function formatSemesterId(id: string): string {
  return formatSemester(semesterFromId(id));
}

function zeroPad(num: number, length: number): string {
  const zero = length - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

function toDateString(date: Date, padding: boolean): string {
  if (padding) {
    return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1, 2)}-${zeroPad(date.getDate(), 2)}`;
  }
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function toTimeString(date: Date): string {
  return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}:${zeroPad(
    date.getSeconds(),
    2,
  )}`;
}

export function formatDate(date?: Date): string {
  if (date === undefined) {
    return t`无`;
  }
  return `${toDateString(date, false)}`;
}

export function formatDateTime(date?: Date): string {
  if (date === undefined) {
    return t`无`;
  }
  return `${toDateString(date, true)} ${toTimeString(date)}`;
}

const FAIL_REASON_MAPPING = {
  [FailReason.BAD_CREDENTIAL]: msg`用户名或密码错误`,
  [FailReason.ERROR_FETCH_FROM_ID]: msg`无法从 id.tsinghua.edu.cn 获取票据`,
  [FailReason.ERROR_ROAMING]: msg`无法使用票据漫游至 learn.tsinghua.edu.cn`,
  [FailReason.NOT_IMPLEMENTED]: msg`功能尚未实现`,
  [FailReason.NOT_LOGGED_IN]: msg`尚未登录`,
  [FailReason.NO_CREDENTIAL]: msg`未提供用户名或密码`,
  [FailReason.UNEXPECTED_STATUS]: msg`非预期的 HTTP 响应状态`,
  [FailReason.INVALID_RESPONSE]: msg`无效的 HTTP 响应`,
  TIMEOUT: msg`请求超时`,
  UNKNOWN: msg`未知错误`,
};

export function failReasonToString(reason: FailReason): string {
  return i18n._(FAIL_REASON_MAPPING[reason] ?? FAIL_REASON_MAPPING.UNKNOWN);
}

const HomeworkGradeLevelNames = {
  [HomeworkGradeLevel.CHECKED]: msg`已阅`,
  [HomeworkGradeLevel.DISTINCTION]: msg`优秀`,
  [HomeworkGradeLevel.EXEMPTED_COURSE]: msg`免课`,
  [HomeworkGradeLevel.EXEMPTION]: msg`免修`,
  [HomeworkGradeLevel.PASS]: msg`通过`,
  [HomeworkGradeLevel.FAILURE]: msg`不通过`,
  [HomeworkGradeLevel.INCOMPLETE]: msg`缓考`,
};

export function formatHomeworkGradeLevel(gradeLevel: HomeworkGradeLevel): MessageDescriptor;
export function formatHomeworkGradeLevel(gradeLevel: undefined): undefined;
export function formatHomeworkGradeLevel(
  gradeLevel?: HomeworkGradeLevel,
): MessageDescriptor | undefined {
  if (gradeLevel) {
    return gradeLevel in HomeworkGradeLevelNames
      ? HomeworkGradeLevelNames[gradeLevel as keyof typeof HomeworkGradeLevelNames]
      : { id: gradeLevel };
  }
}
