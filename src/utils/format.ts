import { t, select } from '@lingui/macro';
import { type SemesterInfo, SemesterType, FailReason } from 'thu-learn-lib';

export function formatSemester(semester: SemesterInfo): string {
  if (semester.type !== SemesterType.UNKNOWN) {
    return `${semester.startYear}-${semester.endYear}-${select(semester.type, {
      fall: '秋季学期',
      spring: '春季学期',
      summer: '夏季学期',
      other: '未知学期',
    })}`;
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
    startYear: parseInt(id.substring(0, 4)),
    endYear: parseInt(id.substring(5, 9)),
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
  [FailReason.BAD_CREDENTIAL]: t`用户名或密码错误`,
  [FailReason.ERROR_FETCH_FROM_ID]: t`无法从 id.tsinghua.edu.cn 获取票据`,
  [FailReason.ERROR_ROAMING]: t`无法使用票据漫游至 learn.tsinghua.edu.cn`,
  [FailReason.NOT_IMPLEMENTED]: t`功能尚未实现`,
  [FailReason.NOT_LOGGED_IN]: t`尚未登录`,
  [FailReason.NO_CREDENTIAL]: t`未提供用户名或密码`,
  [FailReason.UNEXPECTED_STATUS]: t`非预期的 HTTP 响应状态`,
  TIMEOUT: t`请求超时`,
  UNKNOWN: t`未知错误`,
};

export function failReasonToString(reason: FailReason): string {
  return FAIL_REASON_MAPPING[reason] ?? FAIL_REASON_MAPPING.UNKNOWN;
}
