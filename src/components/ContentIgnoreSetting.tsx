import React from 'react';
import { connect } from 'react-redux';
import { ContentType } from 'thu-learn-lib/lib/types';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Switch,
} from '@mui/material';

import styles from '../css/page.module.css';
import { ContentIgnoreSettingProps } from '../types/ui';
import { STATE_DATA } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { resetContentIgnore, toggleContentIgnore } from '../redux/actions/data';
import { COURSE_FUNC } from '../constants/ui';
import { t, tr } from '../utils/i18n';

class ContentIgnoreSetting extends React.PureComponent<ContentIgnoreSettingProps, never> {
  public render() {
    return (
      <section className={styles.ignore_setting}>
        <span className={styles.ignore_setting_title}>{t('Settings_ManageIgnored')}</span>
        <header className={styles.ignore_setting_description}>
          {tr('Settings_ManageIgnored_Content')}
        </header>
        <section className={styles.ignore_setting_container}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Content_CourseName')}</TableCell>
                  {Object.keys(ContentType).map((type) => (
                    <TableCell key={type} align="center">
                      {COURSE_FUNC[`COURSE_${type}`].name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.ignoreState.map((s) => (
                  <TableRow key={s.course.id}>
                    <TableCell component="th" scope="row" key={s.course.id}>
                      {s.course.name}
                    </TableCell>
                    {Object.values(ContentType).map((type) => (
                      <TableCell align="center" key={type}>
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
              color="secondary"
              variant="contained"
              onClick={() => {
                this.props.dispatch(resetContentIgnore());
              }}
            >
              {t('Common_Reset')}
            </Button>
          </div>
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state): ContentIgnoreSettingProps => {
  const data = state[STATE_DATA] as DataState;
  const ignoreState = Object.entries(data.contentIgnore).map((ignore) => ({
    course: data.courseMap.get(ignore[0]),
    ignore: ignore[1],
  }));
  return {
    ignoreState,
  };
};

export default connect(mapStateToProps)(ContentIgnoreSetting);
