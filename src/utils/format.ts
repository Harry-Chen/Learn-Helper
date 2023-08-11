import { SemesterInfo, SemesterType, FailReason } from 'thu-learn-lib/lib/types';
import { t } from './i18n';

export function formatSemester(semester: SemesterInfo): string {
  if (semester.type !== SemesterType.UNKNOWN) {
    return `${semester.startYear}-${semester.endYear}-${t(`SemesterType_${semester.type}`)}`;
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
    return t('Common_None');
  }
  return `${toDateString(date, false)}`;
}

export function formatDateTime(date?: Date): string {
  if (date === undefined) {
    return t('Common_None');
  }
  return `${toDateString(date, true)} ${toTimeString(date)}`;
}

const FAIL_REASON_MAPPING = {
  [FailReason.BAD_CREDENTIAL]: t('FailReason_BadCredential'),
  [FailReason.ERROR_FETCH_FROM_ID]: t('FailReason_ErrorFetchFromID'),
  [FailReason.ERROR_ROAMING]: t('FailReason_ErrorRoaming'),
  [FailReason.NOT_IMPLEMENTED]: t('FailReason_NotImplemented'),
  [FailReason.NOT_LOGGED_IN]: t('FailReason_NotLoggedIn'),
  [FailReason.NO_CREDENTIAL]: t('FailReason_NoCredential'),
  [FailReason.UNEXPECTED_STATUS]: t('FailReason_UnexpectedStatus'),
  TIMEOUT: t('FailReason_Timeout'),
  UNKNOWN: t('FailReason_Unknown'),
};

export function failReasonToString(reason: FailReason): string {
  return FAIL_REASON_MAPPING[reason] ?? FAIL_REASON_MAPPING.UNKNOWN;
}

export const addCSRFTokenToIframeUrl = (csrfToken: string, url?: string): string | undefined => {
  if (url === undefined) {
    return undefined;
  } else {
    const param = `__LEARN_HELPER_CSRF_TOKEN_PARAM__=${csrfToken}`;
    if (url.includes('?')) {
      url += `&${param}`;
    } else {
      url += `?${param}`;
    }
    return url;
  }
};
