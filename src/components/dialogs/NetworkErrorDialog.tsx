import React from 'react';
import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLoginDialog, toggleNetworkErrorDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { loggedIn, refresh } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';

import CommonDialog from './CommonDialog';

class NetworkErrorDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => {
  return {
    open: (state[STATE_UI] as UiState).showNetworkErrorDialog,
    title: '刷新课程信息失败',
    content: (
      <div>
        可能原因有：
        <br />
        · 网络不太给力
        <br />
        · 服务器去思考人生了
        <br />
        · 保存的用户凭据不正确（最近修改过密码？）
        <br />
        如果每次刷新总是在同一阶段失败（进度可通过最上方进度条判断），则可能是因为课程的部分功能被老师关闭，我们暂时无法区分出这一问题。
        您可以在网络学堂中检查每门课程的功能模块，并在离线模式下打开对应的忽略项，即可正常使用。
        <br />
        如果此问题是第一次出现，您可以选择重试、放弃刷新，或者更换新的凭据。
      </div>
    ),
    firstButton: '重试刷新',
    secondButton: '离线查看',
    thirdButton: '更新凭据',
  };
};

const mapDispatchToProps = (dispatch): Partial<ICommonDialogProps> => {
  return {
    firstButtonOnClick: () => {
      dispatch(toggleNetworkErrorDialog(false));
      dispatch(refresh());
    },
    secondButtonOnClick: () => {
      dispatch(toggleNetworkErrorDialog(false));
      dispatch(loggedIn());
    },
    thirdButtonOnClick: () => {
      dispatch(toggleNetworkErrorDialog(false));
      dispatch(toggleLoginDialog(true));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkErrorDialog);
