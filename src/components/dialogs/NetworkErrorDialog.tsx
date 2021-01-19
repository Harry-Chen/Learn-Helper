import React from 'react';
import { connect } from 'react-redux';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleLoginDialog, toggleNetworkErrorDialog } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_UI } from '../../redux/reducers';
import { loggedIn, refresh } from '../../redux/actions/helper';
import { UiState } from '../../redux/reducers/ui';

import CommonDialog from './CommonDialog';

class NetworkErrorDialog extends CommonDialog {}

const mapStateToProps = (state: IUiStateSlice): Partial<ICommonDialogProps> => ({
  open: (state[STATE_UI] as UiState).showNetworkErrorDialog,
  title: '刷新课程信息失败',
  content: (
    <span>
      可能原因有：
      <br />
      · 网络不太给力
      <br />
      · 服务器去思考人生了
      <br />
      · 保存的用户凭据不正确（最近修改过密码？）
      <br />
      您可以选择重试、放弃刷新，或者更换新的凭据。
    </span>
  ),
  firstButton: '重试刷新',
  secondButton: '离线查看',
  thirdButton: '更新凭据',
});

const mapDispatchToProps = (dispatch): Partial<ICommonDialogProps> => ({
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
});

export default connect(mapStateToProps, mapDispatchToProps)(NetworkErrorDialog);
