import React from 'react';
import withStyles from '@material-ui/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = theme => ({
  fab: {
    height: 0,
    width: 0,
    position: 'fixed' as 'fixed',
    margin: '5px',
    'z-index': '1000',
  },
});

class ToggleButton extends React.Component<{
  classes?: any;
  handler?: (e: any) => any
}, null> {

  public render() {
    const { classes, handler } = this.props;

    return (
        <div className={classes.fab} >
          <Fab color="primary" aria-label="Toggle" onClick={handler}>
            <FontAwesomeIcon icon="exchange-alt"/>
          </Fab>
        </div>
    );
  }
}

export default withStyles(styles)(ToggleButton);
