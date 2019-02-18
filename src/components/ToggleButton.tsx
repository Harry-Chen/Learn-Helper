import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../css/sidebar.css';
import { IUiStateSlice, STATE_UI } from '../redux/reducers';
import { AppProps } from '../types/ui';
import { togglePane } from '../redux/actions/ui';

class ToggleButton extends React.PureComponent<
  {
    paneHidden: boolean;
    dispatch: Dispatch<any>;
  },
  never
> {
  public render() {
    const { dispatch } = this.props;

    return (
      <div className={styles.toggle_button}>
        <Fab
          color="primary"
          onClick={() => {
            dispatch(togglePane(!this.props.paneHidden));
          }}
        >
          <FontAwesomeIcon icon="exchange-alt" />
        </Fab>
      </div>
    );
  }
}

const mapStateToProps = (state: IUiStateSlice): Partial<AppProps> => {
  return {
    paneHidden: state[STATE_UI].paneHidden,
  };
};

export default connect(mapStateToProps)(ToggleButton);
