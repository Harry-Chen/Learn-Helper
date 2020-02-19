import { SemesterInfo, SemesterType, FailReason } from 'thu-learn-lib/lib/types';

export function formatSemester(semester: SemesterInfo): string {
  if (semester.type !== SemesterType.UNKNOWN) {
    return `${semester.startYear}-${semester.endYear}-${semester.type}`;
  }
  return SemesterType.UNKNOWN;
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
    return '无';
  }
  return `${toDateString(date, false)}`;
}

export function formatDateTime(date?: Date): string {
  if (date === undefined) {
    return '无';
  }
  return `${toDateString(date, true)} ${toTimeString(date)}`;
}

const FAIL_REASON_MAPPING = {
  [FailReason.BAD_CREDENTIAL]: '用户名或密码错误',
  [FailReason.ERROR_FETCH_FROM_ID]: '无法从 id.tsinghua.edu.cn 获取票据',
  [FailReason.ERROR_ROAMING]: '无法使用票据漫游至 learn.tsinghua.edu.cn',
  [FailReason.NOT_IMPLEMENTED]: '功能尚未实现',
  [FailReason.NOT_LOGGED_IN]: '登录超时',
  [FailReason.NO_CREDENTIAL]: '未提供用户名或密码',
};

export function failReasonToString(reason: FailReason): string {
  return FAIL_REASON_MAPPING[reason];
}
