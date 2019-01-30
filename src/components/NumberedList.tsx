import React from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import withStyles from '@material-ui/styles/withStyles';
import '../utils/fontawesome.ts';
import ListNumber from './ListNumber';
import { INumberedListData } from '../types/SideBar';

const useStyles = _ => ({
  numbered_list: {
    width: '100%',
    maxWidth: 360,
  },
  list_title: {
    'margin-left': '10px',
  },
  list_icon: {
    width: '18px',
    height: '18px',
  },
});

class NumberedList extends React.Component<INumberedListData, null> {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes, name, icon, items, numbers } = this.props;

    return (
        <List
            className={classes.numbered_list}
            component="nav"
            subheader={<ListSubheader component="div">
              <FontAwesomeIcon icon={icon}/>
              <span className={classes.list_title}>{name}</span>
            </ListSubheader>}
        >
          {
            items.map(i => (
                <ListItem button={true} key={i.name}>
                  <ListItemIcon className={classes.list_icon}>
                    <FontAwesomeIcon icon={i.icon}/>
                  </ListItemIcon>
                  <ListItemText primary={i.name}/>
                  <ListNumber number={numbers[i.name]}/>
                </ListItem>
            ))
          }
        </List>
    );
  }
}

export default withStyles(useStyles)(NumberedList);
