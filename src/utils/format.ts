import { SemesterInfo, SemesterType } from 'thu-learn-lib/lib/types';

export function formatSemester(semester: SemesterInfo): string {
  if (semester.type !== SemesterType.UNKNOWN) {
    return `${semester.startYear}-${semester.endYear}-${semester.type}`;
  } else {
    return SemesterType.UNKNOWN;
  }
}

export function formatDate(date?: Date): string {
  if (date === undefined) {
    return '无';
  } else {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
