import React from 'react';
import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../css/sidebar.css';

class ToggleButton extends React.Component<
  {
    classes?: any;
    handler?: (e: any) => any;
  },
  null
> {
  public render() {
    const { handler } = this.props;

    return (
      <div className={styles.toggle_button}>
        <Fab color="primary" aria-label="Toggle" onClick={handler}>
          <FontAwesomeIcon icon="exchange-alt" />
        </Fab>
      </div>
    );
  }
}

export default ToggleButton;
