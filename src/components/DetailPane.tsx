import React from 'react';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';

import { IUiStateSlice, STATE_UI } from '../redux/reducers';
import { UiState } from '../redux/reducers/ui';
import { DetailPaneProps } from '../types/ui';
import ContentIgnoreSetting from './ContentIgnoreSetting';

class DetailPane extends React.PureComponent<DetailPaneProps, any> {
  public render() {
    if (this.props.showIgnoreSettings) {
      return (<ContentIgnoreSetting/>)
    } else if (this.props.content !== undefined) {
      const { content, dispatch } = this.props;
      return JSON.stringify(content);
    } else {
      return (
        <Iframe url={this.props.url}/>
      );
    }
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
