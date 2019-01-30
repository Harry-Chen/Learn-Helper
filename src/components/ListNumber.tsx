import React from 'react';

import styles from '../css/sidebar.css';

class ListNumber extends React.Component<{
  classes?: any;
  number: number | undefined;
}, null> {

  public render() {
    const { number } = this.props;
    if (number !== undefined) {
      return (<span className={styles.list_number}>{number}</span>);
    }
    return null;
  }
}

export default ListNumber;
