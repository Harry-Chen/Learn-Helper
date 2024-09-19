import { Trans } from '@lingui/macro';
import classNames from 'classnames';
import { Link, Route } from 'wouter';

import styles from '../../css/doc.module.css';
import About from './about';
import Changelog from './changelog';
import Readme from './readme';

const Doc = () => {
  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <Route path="/readme" component={Readme} />
        <Route path="/about" component={About} />
        <Route path="/changelog" component={Changelog} />
        <Link to="~/" className={styles.doc_back_link}>
          <Trans>返回</Trans>
        </Link>
      </div>
    </main>
  );
};

export default Doc;
