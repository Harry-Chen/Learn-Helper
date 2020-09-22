import React from 'react';
import Iframe from 'react-iframe';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { IUiStateSlice, STATE_UI } from '../redux/reducers';
import { UiState } from '../redux/reducers/ui';
import { DetailPaneProps } from '../types/ui';

import ContentIgnoreSetting from './ContentIgnoreSetting';
import ContentDetail from './ContentDetail';

import styles from '../css/main.css';

class DetailPane extends React.PureComponent<DetailPaneProps, {frameUrl?: string}> {
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
      this.setState({ frameUrl: this.props.url });
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
          <Iframe className={styles.web_frame} url={this.state?.frameUrl} />
        ) : null}
      </section>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): DetailPaneProps => {
  const uiState = state[STATE_UI] as UiState;
  return {
    url: uiState.detailUrl,
    content: uiState.detailContent,
    showIgnoreSettings: uiState.showContentIgnoreSetting,
  };
};

export default connect(mapStateToProps)(DetailPane);
