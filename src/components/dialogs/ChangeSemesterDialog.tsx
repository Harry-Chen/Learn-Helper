import React from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { ICommonDialogProps } from '../../types/dialogs';
import { toggleChangeSemesterDialog, toggleIgnoreWrongSemester } from '../../redux/actions/ui';
import { IUiStateSlice, STATE_DATA, STATE_UI } from '../../redux/reducers';
import { formatSemesterId, semesterFromId } from '../../utils/format';
import { insistSemester, updateSemester } from '../../redux/actions/data';
import { refresh } from '../../redux/actions/helper';
import { DataState } from '../../redux/reducers/data';
import { UiState } from '../../redux/reducers/ui';

import CommonDialog from './CommonDialog';
import styles from '../../css/main.css';

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
        切换学期将导致所有配置（隐藏）和状态（已读、星标）丢失，请三思！
        <br />
        当前 Learn Helper 学期：
        {formatSemesterId(this.props.semester)}
        <br />
        当前网络学堂学期（注册中心控制）：
        {formatSemesterId(this.props.latestSemester)}
        <br />
        <FormControl className={styles.form_control}>
          <InputLabel id="select-semester">选择学期</InputLabel>
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
  return {
    open: (state[STATE_UI] as UiState).showChangeSemesterDialog,
    semester: data.semester?.id ?? '',
    semesters: data.semesters ?? [],
    latestSemester: data.fetchedSemester.id,
    title: '切换学期',
    content: null,
    firstButton: '确定',
    secondButton: '取消',
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
