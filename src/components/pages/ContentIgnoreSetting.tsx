import React from 'react';
import { ContentType } from 'thu-learn-lib';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

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

import styles from '../../css/page.module.css';
import { resetContentIgnore, toggleContentIgnore } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { COURSE_MAIN_FUNC } from '../../constants/ui';

const ContentIgnoreSetting = () => {
  const { _ } = useLingui();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.data.courseMap);
  const contentIgnore = useAppSelector((state) => state.data.contentIgnore);

  return (
    <section className={styles.ignore_setting}>
      <span className={styles.ignore_setting_title}>
        <Trans>管理隐藏项</Trans>
      </span>
      <header className={styles.ignore_setting_description}>
        <Trans>
          此处的更改在下一次刷新时生效，并且只在汇总功能中起作用。
          <br />
          如果您重新启用一个隐藏的项目，原本的项目属性（是否已读、加星标）不会发生变化。
        </Trans>
      </header>
      <section className={styles.ignore_setting_container}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans>课程名称</Trans>
                </TableCell>
                {Object.values(ContentType).map((type) => (
                  <TableCell key={type} align="center">
                    {_(COURSE_MAIN_FUNC[type].name)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(contentIgnore).map(([cid, ignore]) => (
                <TableRow key={cid}>
                  <TableCell component="th" scope="row" key={cid}>
                    {_({ id: `course-${courses[cid].id}` })}
                  </TableCell>
                  {Object.values(ContentType).map((type) => (
                    <TableCell align="center" key={type}>
                      <Switch
                        checked={ignore[type]}
                        onChange={() => {
                          dispatch(toggleContentIgnore({ id: cid, type, state: !ignore[type] }));
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
              dispatch(resetContentIgnore());
            }}
          >
            <Trans>重置</Trans>
          </Button>
        </div>
      </section>
    </section>
  );
};

export default ContentIgnoreSetting;
