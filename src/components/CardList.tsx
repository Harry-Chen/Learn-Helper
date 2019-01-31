import React from 'react';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/FontAwesomeLibrary.ts';
import { ICardListData } from '../types/SideBar';
import DetailCard from './DetailCard';

class CardList extends React.Component<ICardListData, null> {

  public render() {
    const { title, items } = this.props;

    return (
        <List
            className={styles.card_list_header}
            component="nav"
            subheader={<ListSubheader component="div">
              <span className={styles.card_list_header_text}>{title}</span>
            </ListSubheader>}
        >
          {items.map(i => (<DetailCard card={i} key={i.link}/>))}
        </List>
    );

  }

}

export default CardList;
