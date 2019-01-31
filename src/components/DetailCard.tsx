import React from 'react';

import { CardData } from '../types/SideBar';

class DetailCard extends React.Component<{
  card: CardData;
}, null> {

  public render(): React.ReactNode {
    return (<span>{JSON.stringify(this.props.card)}<br /></span>);
  }
}

export default DetailCard;
