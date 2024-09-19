import { Trans } from '@lingui/macro';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { clearAllData, refresh, toggleClearDataDialog } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const ClearDataDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showClearDataDialog);

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>清除所有缓存</Trans>
      </DialogTitle>
      <DialogContent>
        <Trans>确认要清除吗？所有缓存的数据和已读状态将会被清除。</Trans>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            dispatch(toggleClearDataDialog(false));
            dispatch(clearAllData());
            dispatch(refresh());
          }}
        >
          <Trans>是</Trans>
        </Button>
        <Button color="primary" onClick={() => dispatch(toggleClearDataDialog(false))}>
          <Trans>否</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClearDataDialog;
