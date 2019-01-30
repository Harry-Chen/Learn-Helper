import { library } from '@fortawesome/fontawesome-svg-core';
import * as fa from '@fortawesome/free-solid-svg-icons';

const ICON_TO_USE = [
  fa.faThumbtack,
  fa.faHome,
  fa.faPencilAlt,
  fa.faBullhorn,
  fa.faDownload,
  fa.faQuestion,
  fa.faInbox,
  fa.faWrench,
  fa.faCog,
  fa.faCogs,
  fa.faEnvelope,
  fa.faSync,
  fa.faUser,
  fa.faTrash,
  fa.faInfoCircle,
  fa.faExternalLinkAlt,
  fa.faExchangeAlt,
  fa.faAngleDown,
  fa.faAngleUp,
];

ICON_TO_USE.map(i => library.add(i));
