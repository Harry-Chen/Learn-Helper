import { SemesterInfo } from 'thu-learn-lib/lib/types';

export function formatSemester(semester: SemesterInfo): string {
  return `${semester.startYear}-${semester.endYear}-${semester.type}`;
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
