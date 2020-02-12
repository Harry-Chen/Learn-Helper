import React from 'react';
import { connect } from 'react-redux';
import { ContentType } from 'thu-learn-lib/lib/types';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

import styles from '../css/page.css';
import { ContentIgnoreSettingProps } from '../types/ui';
import { STATE_DATA } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { resetContentIgnore, toggleContentIgnore } from '../redux/actions/data';
import { COURSE_FUNC } from '../constants/ui';

class ContentIgnoreSetting extends React.PureComponent<ContentIgnoreSettingProps, never> {
  public render() {
    return (
      <section className={styles.ignore_setting}>
        <span className={styles.ignore_setting_title}>管理隐藏项</span>
        <header className={styles.ignore_setting_description}>
          此处的更改在下一次刷新时生效，并且只在汇总功能中起作用。
          <br />
          如果您重新启用一个隐藏的项目，原本的项目属性（是否已读、加星标）不会发生变化。
        </header>
        <section className={styles.ignore_setting_container}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>课程名称</TableCell>
                  {Object.keys(ContentType).map(type => (
                    <TableCell key={type} align={'center'}>
                      {COURSE_FUNC[`COURSE_${type}`].name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.ignoreState.map(s => (
                  <TableRow key={s.course.id}>
                    <TableCell component="th" scope="row" key={s.course.id}>
                      {s.course.name}
                    </TableCell>
                    {Object.values(ContentType).map(type => (
                      <TableCell align={'center'} key={type}>
                        <Switch
                          checked={s.ignore[type]}
                          onChange={() => {
                            this.props.dispatch(
                              toggleContentIgnore(s.course.id, type, !s.ignore[type]),
                            );
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <div className={styles.ignore_setting_reset_button}>
            <Button
              color={'secondary'}
              variant={'contained'}
              onClick={() => {
                this.props.dispatch(resetContentIgnore());
              }}
            >
              重置
            </Button>
          </div>
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state): ContentIgnoreSettingProps => {
  const data = state[STATE_DATA] as DataState;
  const ignoreState = Object.entries(data.contentIgnore).map(ignore => {
    return {
      course: data.courseMap.get(ignore[0]),
      ignore: ignore[1],
    };
  });
  return {
    ignoreState,
  };
};

export default connect(mapStateToProps)(ContentIgnoreSetting);
