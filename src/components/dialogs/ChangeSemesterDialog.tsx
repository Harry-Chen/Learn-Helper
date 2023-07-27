import React from 'react';
import { connect } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleChangeSemesterDialog, toggleIgnoreWrongSemester } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_DATA, STATE_UI } from '../../redux/reducers';
import { formatSemesterId, semesterFromId } from '../../utils/format';
import { insistSemester, updateSemester } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { DataState } from '../../redux/reducers/data';
import { UiState } from '../../redux/reducers/ui';
import { tr, t } from '../../utils/i18n';

import CommonDialog from './CommonDialog';
import styles from '../../css/main.module.css';

interface IChangeSemesterDialogProps extends ICommonDialogProps {
  semester: string;
  semesters: string[];
  latestSemester: string;
}

interface IChangeSemesterDialogState {
  newSemester: string;
}

class ChangeSemesterDialog extends CommonDialog<
  IChangeSemesterDialogProps,
  IChangeSemesterDialogState
> {
  constructor(props: IChangeSemesterDialogProps) {
    super(props);
    this.state = {
      newSemester: this.props.semesters.includes(this.props.semester)
        ? this.props.semester
        : this.props.semesters[0] ?? '', // in case current semester not in fetched list
    };
  }

  public getContent(): React.ReactNode {
    return (
      <span>
        {tr('ChangeSemesterDialog_Content', [
          formatSemesterId(this.props.semester),
          formatSemesterId(this.props.latestSemester),
        ])}
        <br />
        <FormControl className={styles.form_control}>
          <InputLabel id="select-semester">{t('ChangeSemesterDialog_SelectSemester')}</InputLabel>
          <Select
            labelId="select-semester"
            value={this.state.newSemester}
            onChange={(e) => {
              this.setState({
                newSemester: e.target.value as string,
              });
            }}
          >
            {this.props.semesters.map((s) => (
              <MenuItem value={s} key={s}>
                {formatSemesterId(s)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </span>
    );
  }

  public firstButtonClick = () => {
    if (this.state.newSemester !== this.props.semester) {
      this.props.dispatch(updateSemester(semesterFromId(this.state.newSemester)));
      this.props.dispatch(insistSemester(false));
      this.props.dispatch(toggleIgnoreWrongSemester(true));
      this.props.dispatch(refresh());
    }
    this.props.dispatch(toggleChangeSemesterDialog(false));
  };
}

const mapStateToProps = (state: IUiStateSlice): Partial<IChangeSemesterDialogProps> => {
  const data = state[STATE_DATA] as DataState;
  const allSemesters = data.semesters ?? [];
  const currentWebSemester = data.fetchedSemester.id;

  // insert current semester if not fetched from API
  if (allSemesters.indexOf(currentWebSemester) == -1) {
    allSemesters.unshift(currentWebSemester);
  }

  return {
    open: (state[STATE_UI] as UiState).showChangeSemesterDialog,
    semester: data.semester?.id ?? '',
    semesters: allSemesters,
    latestSemester: currentWebSemester,
    title: t('ChangeSemesterDialog_Title'),
    content: null,
    firstButton: t('Common_Ok'),
    secondButton: t('Common_Cancel'),
  };
};

const mapDispatchToProps = (dispatch): Partial<IChangeSemesterDialogProps> => ({
  dispatch,
  firstButtonOnClick: null,
  secondButtonOnClick: () => {
    dispatch(toggleChangeSemesterDialog(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeSemesterDialog);
