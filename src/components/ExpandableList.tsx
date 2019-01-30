import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import withStyles from '@material-ui/styles/withStyles';
import '../utils/fontawesome.ts';
import { Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { IExpandableListData } from '../types/SideBar';

const useStyles = theme => ({
  course_list_item: {
    width: '100%',
    maxWidth: 360,
  },
  list_title: {
    'margin-left': '10px',
  },
  func_list: {
    'padding-left': '10px',
  },
  list_icon: {
    width: '18px',
    height: '18px',
  },
});

class ExpandableList extends React.Component<IExpandableListData, {
  opened: object;
}> {

  state = { opened: {} };

  constructor(props) {
    super(props);
    props.items.map(i => this.state.opened[i.name] = false);
  }

  render() {

    const { classes, name, icon, items, subitems } = this.props;

    return (
        <List
            className={classes.course_list_item}
            component="nav"
            subheader={
              <ListSubheader component="div">
                <FontAwesomeIcon icon={icon}/>
                <span className={classes.list_title}>{name}</span>
              </ListSubheader>
            }
        >

          {
            items.map(i => (
                <div key={i.name}>
                  <ListItem button={true} onClick={() => this.handleClick(i.name)}>
                    <ListItemIcon className={classes.list_icon}>
                      <FontAwesomeIcon icon={i.icon}/>
                    </ListItemIcon>
                    <ListItemText primary={i.name}/>
                    {this.state.opened[i.name] ? <ExpandLess/> : <ExpandMore/>}
                  </ListItem>
                  <Collapse in={this.state.opened[i.name]} timeout="auto" unmountOnExit={true}>
                    <List
                        className={classes.func_list}
                        // component="div"
                        disablePadding={true}
                    >
                      {
                        subitems.map(s => (
                            <ListItem button={true} key={s.name}>
                              <ListItemIcon className={classes.list_icon}>
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

export default withStyles(useStyles)(ExpandableList);
