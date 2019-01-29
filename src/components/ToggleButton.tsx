import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = theme => ({
  fab: {
    position: 'fixed' as 'fixed',
    margin: '5px',
    'z-index': '1000',
  },
});

function ToggleButton(props) {

  const { classes, handler } = props;

  return (
      <div>
        <Fab color="primary" aria-label="Toggle" className={classes.fab} onClick={handler}>
          <FontAwesomeIcon icon="exchange-alt"/>
        </Fab>
      </div>
  );
}

ToggleButton.propTypes = {
  classes: PropTypes.object.isRequired,
  handler: PropTypes.func,
};

export default withStyles(styles)(ToggleButton);
