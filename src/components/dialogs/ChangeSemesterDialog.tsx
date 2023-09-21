import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import {
  toggleChangeSemesterDialog,
  toggleIgnoreWrongSemester,
  insistSemester,
  updateSemester,
  refresh,
  setCardFilter,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectSemesters } from '../../redux/selectors';
import { formatSemesterId, semesterFromId } from '../../utils/format';

import styles from '../../css/main.module.css';

const ChangeSemesterDialog = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.ui.showChangeSemesterDialog);
  const semester = useAppSelector((state) => state.data.semester?.id ?? '');
  const currentWebSemester = useAppSelector((state) => state.data.fetchedSemester.id);
  const semesters = useAppSelector(selectSemesters);

  const [newSemester, setNewSemester] = useState(
    semesters.includes(semester) ? semester : semesters[0] ?? '',
  );

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle>
        <Trans>切换学期</Trans>
      </DialogTitle>
      <DialogContent>
        <span>
          <Trans>
            切换学期将导致所有配置（隐藏）和状态（已读、星标）丢失，请三思！
            <br />
            当前 Learn Helper 学期：{formatSemesterId(semester)}
            <br />
            当前网络学堂学期（注册中心控制）：{formatSemesterId(currentWebSemester)}
          </Trans>
          <br />
          <FormControl className={styles.form_control}>
            <InputLabel id="select-semester">
              <Trans>选择学期</Trans>
            </InputLabel>
            <Select
              labelId="select-semester"
              value={newSemester}
              onChange={(e) => setNewSemester(e.target.value)}
            >
              {semesters.map((s) => (
                <MenuItem value={s} key={s}>
                  {formatSemesterId(s)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </span>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            if (newSemester !== semester) {
              dispatch(updateSemester(semesterFromId(newSemester)));
              dispatch(insistSemester(false));
              dispatch(toggleIgnoreWrongSemester(true));
              dispatch(setCardFilter({}));
              dispatch(refresh());
            }
            dispatch(toggleChangeSemesterDialog(false));
          }}
        >
          <Trans>确定</Trans>
        </Button>
        <Button color="primary" onClick={() => dispatch(toggleChangeSemesterDialog(false))}>
          <Trans>取消</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeSemesterDialog;
