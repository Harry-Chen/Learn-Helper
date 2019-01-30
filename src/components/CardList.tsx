import React from 'react';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/FontAwesomeLibrary.ts';
import { ICardListData } from '../types/SideBar';

class CardList extends React.Component<ICardListData, any> {

  public render() {
    const { title, items } = this.props;

    return (
        <List
            className="numbered_list"
            component="nav"
            subheader={<ListSubheader component="div">
              <span className={styles.list_title}>{title}</span>
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

export default CardList;
