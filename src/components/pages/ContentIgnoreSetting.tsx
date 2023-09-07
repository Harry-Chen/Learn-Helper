import React from 'react';
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
import { ContentType } from 'thu-learn-lib';

import styles from '../../css/page.module.css';
import { resetContentIgnore, toggleContentIgnore } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { COURSE_FUNC } from '../../constants/ui';
import { t, tr } from '../../utils/i18n';

const ContentIgnoreSetting = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.data.courseMap);
  const contentIgnore = useAppSelector((state) => state.data.contentIgnore);

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
              {Object.entries(contentIgnore).map(([cid, ignore]) => (
                <TableRow key={cid}>
                  <TableCell component="th" scope="row" key={cid}>
                    {courses[cid].name}
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
            {t('Common_Reset')}
          </Button>
        </div>
      </section>
    </section>
  );
};

export default ContentIgnoreSetting;
