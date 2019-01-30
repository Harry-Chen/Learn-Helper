import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/FontAwesomeLibrary.ts';
import { IExpandableListData } from '../types/SideBar';

class ExpandableList extends React.Component<IExpandableListData, {
  opened: {
    [key: string]: boolean;
  };
}> {

  state = { opened: {} };

  constructor(props) {
    super(props);
    props.items.map(i => this.state.opened[i.name] = false);
  }

  render() {

    const { name, icon, items, subitems } = this.props;

    return (
        <List
            className={styles.course_list}
            component="nav"
            subheader={
              <ListSubheader component="div">
                <FontAwesomeIcon icon={icon}/>
                <span className={styles.list_title}>{name}</span>
              </ListSubheader>
            }
        >

          {
            items.map(i => (
                <div key={i.name}>
                  <ListItem button={true} onClick={() => this.handleClick(i.name)}>
                    <ListItemIcon className={styles.list_icon}>
                      <FontAwesomeIcon icon={i.icon}/>
                    </ListItemIcon>
                    <ListItemText primary={i.name}/>
                    <FontAwesomeIcon icon={this.state.opened[i.name] ? 'angle-up' : 'angle-down'}/>
                  </ListItem>
                  <Collapse in={this.state.opened[i.name]} timeout="auto" unmountOnExit={true}>
                    <List
                        className={styles.subfunc_list}
                        disablePadding={true}
                    >
                      {
                        subitems.map(s => (
                            <ListItem button={true} key={s.name}>
                              <ListItemIcon className={styles.list_icon}>
                                <FontAwesomeIcon icon={s.icon}/>
                              </ListItemIcon>
                              <ListItemText primary={s.name}/>
                            </ListItem>
                        ))
                      }
                    </List>
                  </Collapse>
                </div>
            ))
          }
        </List>
    );
  }

  private handleClick = (name) => {
    this.setState({
      opened: { ...this.state.opened, [name]: !this.state.opened[name] },
    });
  }

}

export default ExpandableList;
