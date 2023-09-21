import React from 'react';
import { Trans } from '@lingui/macro';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import {
  toggleIgnoreWrongSemester,
  toggleNewSemesterDialog,
  insistSemester,
  syncSemester,
  refresh,
  setCardFilter,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { formatSemester } from '../../utils/format';

const NewSemesterDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showNewSemesterDialog);
  const semester = useAppSelector((state) => state.data.semester);
  const fetchedSemester = useAppSelector((state) => state.data.fetchedSemester);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>检测到新学期</Trans>
      </DialogTitle>
      <DialogContent>
        <Trans>
          当前 Learn Helper 学期：{formatSemester(semester)}
          <br />
          当前网络学堂学期：{formatSemester(fetchedSemester)}
          <br />
          是否要进行学期切换（本学期已读、星标等状态将会被清空）？
          <br />
          如果选择“否”，则在下一次打开 Learn Helper 前都将保持当前学期。
          <br />
          如果选择“不再询问”，则需要手动进行学期切换。
        </Trans>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNewSemesterDialog(false));
            dispatch(syncSemester());
            dispatch(setCardFilter({}));
            dispatch(refresh());
          }}
        >
          <Trans>是</Trans>
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNewSemesterDialog(false));
            dispatch(toggleIgnoreWrongSemester(true));
            dispatch(refresh());
          }}
        >
          <Trans>否</Trans>
        </Button>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleNewSemesterDialog(false));
            dispatch(insistSemester(true));
            dispatch(refresh());
          }}
        >
          <Trans>不再询问</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSemesterDialog;
