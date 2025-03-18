import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import {
  Button,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { COURSE_MAIN_FUNC } from '../constants/ui';
import styles from '../css/page.module.css';
import { resetContentIgnore, toggleContentIgnore } from '../redux/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

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
                {Object.values(COURSE_MAIN_FUNC).map((func) => (
                  <TableCell key={func.type} align="center">
                    {_(func.name)}
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
                  {Object.values(COURSE_MAIN_FUNC).map((func) => (
                    <TableCell align="center" key={func.type}>
                      <Switch
                        checked={ignore[func.type]}
                        onChange={() => {
                          dispatch(
                            toggleContentIgnore({
                              id: cid,
                              type: func.type,
                              state: !ignore[func.type],
                            }),
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
