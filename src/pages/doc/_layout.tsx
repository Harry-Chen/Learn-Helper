import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useNavigate } from '../../router';

import styles from '../../css/doc.module.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <Outlet />
        <button className={styles.doc_back_link} onClick={() => navigate(-1)}>
          <Trans>返回</Trans>
        </button>
      </div>
    </main>
  );
};

export default About;
