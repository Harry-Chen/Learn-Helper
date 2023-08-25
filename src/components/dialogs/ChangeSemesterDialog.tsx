import React, { useState } from 'react';
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
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectSemesters } from '../../redux/selectors';
import { formatSemesterId, semesterFromId } from '../../utils/format';
import { tr, t } from '../../utils/i18n';

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
      <DialogTitle>{t('ChangeSemesterDialog_Title')}</DialogTitle>
      <DialogContent>
        <span>
          {tr('ChangeSemesterDialog_Content', [
            formatSemesterId(semester),
            formatSemesterId(currentWebSemester),
          ])}
          <br />
          <FormControl className={styles.form_control}>
            <InputLabel id="select-semester">{t('ChangeSemesterDialog_SelectSemester')}</InputLabel>
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
              dispatch(refresh());
            }
            dispatch(toggleChangeSemesterDialog(false));
          }}
        >
          {t('Common_Ok')}
        </Button>
        <Button color="primary" onClick={() => dispatch(toggleChangeSemesterDialog(false))}>
          {t('Common_Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeSemesterDialog;
