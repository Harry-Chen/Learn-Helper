import { library } from '@fortawesome/fontawesome-svg-core';

import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons/faBullhorn';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faInbox } from '@fortawesome/free-solid-svg-icons/faInbox';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons/faChalkboardTeacher';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons/faClipboardCheck';
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

const ICON_TO_USE = [
  faThumbtack,
  faHome,
  faPencilAlt,
  faBullhorn,
  faDownload,
  faQuestion,
  faInbox,
  faWrench,
  faCog,
  faCogs,
  faEnvelope,
  faSync,
  faUser,
  faTrash,
  faInfoCircle,
  faExternalLinkAlt,
  faExchangeAlt,
  faAngleDown,
  faAngleUp,
  faStar,
  faCheck,
  faUpload,
  faPaperclip,
  faBook,
  faChalkboardTeacher,
  faClipboardCheck,
  faClipboard,
  faSearch,
];

ICON_TO_USE.map(i => library.add(i));
