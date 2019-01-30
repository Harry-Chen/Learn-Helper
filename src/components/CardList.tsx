import React from 'react';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import withStyles from '@material-ui/styles/withStyles';

import '../constants/FontAwesomeLibrary.ts';
import { ICardListData } from '../types/SideBar';

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

class CardList extends React.Component<ICardListData, any> {

  public render() {
    const { classes, title, items } = this.props;

    return (
        <List
            className={classes.numbered_list}
            component="nav"
            subheader={<ListSubheader component="div">
              <span className={classes.list_title}>{title}</span>
            </ListSubheader>}
        >
          {
            items.map(i => (
                {i}
            ))
          }
        </List>
    );

  }

}

export default withStyles(useStyles)(CardList);
