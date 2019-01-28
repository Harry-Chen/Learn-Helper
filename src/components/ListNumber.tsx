import withStyles from "@material-ui/styles/withStyles";
import React from 'react';

const numberStyle = _ => ({
  root: {
    'border-radius': '3px',
    background: '#1a181d',
    color: '#eeeeee',
    padding: '0 5px',
    'box-shadow': 'inset 0 1px 2px #0f0e11',
  },
});

function ListNumber(props) {
  const { classes, number } = props;
  if (number !== undefined) {
    return (<span className={classes.root}>{number}</span>);
  }
  return null;
}

export default withStyles(numberStyle)(ListNumber)
