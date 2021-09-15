import React from 'react';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';

import { IUiStateSlice, STATE_UI, STATE_HELPER } from '../redux/reducers';
import { UiState } from '../redux/reducers/ui';
import { HelperState } from '../redux/reducers/helper';
import { DetailPaneProps } from '../types/ui';

import ContentIgnoreSetting from './ContentIgnoreSetting';
import ContentDetail from './ContentDetail';

import styles from '../css/main.css';

declare const __LEARN_HELPER_CSRF_TOKEN_PARAM__: string;

const addTokenToUrl = (csrfToken: string, url?: string): string | undefined => {
  if (url === undefined){
    return undefined;
  } else {
    const param = `${__LEARN_HELPER_CSRF_TOKEN_PARAM__}=${csrfToken}`
    if (url.includes('?')) {
      url += `&${param}`;
    } else {
      url += `?${param}`;
    }
    return url;
  }
}

class DetailPane extends React.PureComponent<DetailPaneProps, { frameUrl?: string }> {
  public render() {
    if (this.props.showIgnoreSettings) {
      return <ContentIgnoreSetting />;
    }
    if (this.props.content !== undefined) {
      return <ContentDetail content={this.props.content} />;
    }

    // When prop `url` is changed, first remove the IFrame label and then recreate it,
    // rather than reuse the old one.
    const shouldRemoveIframeFirst = this.props.url && this.state?.frameUrl !== this.props.url;
    if (shouldRemoveIframeFirst) {
      if (shouldRemoveIframeFirst) {
        setTimeout(() => this.setState({ frameUrl: this.props.url }), 100);
      }
    }

    return (
      <section
        style={{
          height: 'calc(100% - 64px)',
          width: '100%',
          position: 'relative',
        }}
      >
        {!shouldRemoveIframeFirst ? (
          <Iframe
            id="content-frame"
            className={styles.web_frame}
            url={addTokenToUrl(this.props.csrfToken, this.state?.frameUrl)}
          />
        ) : null}
      </section>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): DetailPaneProps => {
  const uiState = state[STATE_UI] as UiState;
  const helperState = state[STATE_HELPER] as HelperState;
  return {
    url: uiState.detailUrl,
    content: uiState.detailContent,
    showIgnoreSettings: uiState.showContentIgnoreSetting,
    csrfToken: helperState.helper.getCSRFToken(),
  };
};

export default connect(mapStateToProps)(DetailPane);
