import { SemesterInfo, SemesterType } from 'thu-learn-lib/lib/types';

export function formatSemester(semester: SemesterInfo): string {
  if (semester.type !== SemesterType.UNKNOWN) {
    return `${semester.startYear}-${semester.endYear}-${semester.type}`;
  } else {
    return SemesterType.UNKNOWN;
  }
}

function zeroPad(num: number, length: number): string {
  const zero = length - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

function toDateString(date: Date, padding: boolean): string {
  if (padding) {
    return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1, 2)}-${zeroPad(date.getDate(), 2)}`;
  } else {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}

function toTimeString(date: Date): string {
  return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(),
    2)}:${zeroPad(date.getSeconds(), 2)}`;
}

export function formatDate(date?: Date): string {
  if (date === undefined) {
    return '无';
  } else {
    return `${toDateString(date, false)}`;
  }
}

export function formatDateTime(date?: Date): string {
  if (date === undefined) {
    return '无';
  } else {
    return `${toDateString(date, true)} ${toTimeString(date)}`;
  }
}
