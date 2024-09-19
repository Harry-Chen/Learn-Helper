import { Trans } from '@lingui/macro';
import classNames from 'classnames';
import { Link } from 'wouter';

import styles from '../css/doc.module.css';
import bg from '../image/bg.png';
import bgDark from '../image/bg_dark.png';

const Welcome = () => {
  return (
    <main className={classNames(styles.wrapper, styles.welcome_wrapper)}>
      <section className={styles.welcome_content}>
        <section className={styles.welcome_banner}>
          <img src={bg} alt="Learn Helper" className={styles.welcome_banner_light} />
          <img src={bgDark} alt="Learn Helper" className={styles.welcome_banner_dark} />
        </section>
        <section className={styles.welcome_menu}>
          <Link to="/doc/readme" className={styles.welcome_navigation}>
            <Trans>使用手册</Trans>
          </Link>
          {' | '}
          <Link to="/doc/about" className={styles.welcome_navigation}>
            <Trans>关于我们</Trans>
          </Link>
          {' | '}
          <Link to="/doc/changelog" className={styles.welcome_navigation}>
            <Trans>更新记录</Trans>
          </Link>
          <br />
          <a
            href="https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall?hl=zh-CN"
            target="_blank"
            rel="noreferrer"
          >
            Chrome Store
          </a>
          {' | '}
          <a
            href="https://microsoftedge.microsoft.com/addons/detail/dhddjfhadejlhiaafnbadhaeichbkgil"
            target="_blank"
            rel="noreferrer"
          >
            Edge Addons
          </a>
          {' | '}
          <a href="https://harrychen.xyz/learn/" target="_blank" rel="noreferrer">
            FireFox / 开发版
          </a>
          <div className={styles.welcome_version}>
            {__GIT_VERSION__} (built on {__BUILD_HOSTNAME__} at {__BUILD_TIME__})
            <br />
          </div>
          <div className={styles.welcome_packages}>
            thu-learn-lib: v{__THU_LEARN_LIB_VERSION__} <br />
            React: v{__REACT_VERSION__} <br />
            MUI: v{__MUI_VERSION__} <br />
          </div>
        </section>
      </section>
      <footer className={styles.welcome_footer}>
        <p className={styles.welcome_copyright}>
          &copy; 2013-2023 <a href="mailto:xxr3376@gmail.com">UGeeker</a>&nbsp;BrianLi&nbsp;
          <a href="https://github.com/Harry-Chen">HarryChen</a>&nbsp;
          <a href="https://github.com/AsakuraMizu">AsakuraMizu</a>
        </p>
      </footer>
    </main>
  );
};

export default Welcome;
