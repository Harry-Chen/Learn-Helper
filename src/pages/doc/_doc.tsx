import classNames from 'classnames';
import { Link, Route } from 'wouter';
import { Trans } from '@lingui/macro';

import styles from '../../css/doc.module.css';
import Readme from './readme';
import Changelog from './changelog';

const Doc = () => {
  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <Route path="/readme" component={Readme} />
        <Route path="/about" component={Doc} />
        <Route path="/changelog" component={Changelog} />
        <Link to="~/" className={styles.doc_back_link}>
          <Trans>返回</Trans>
        </Link>
      </div>
    </main>
  );
};

export default Doc;
