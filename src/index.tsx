import React from 'react';
import ReactDOM from 'react-dom';
import Iframe from 'react-iframe';
import classnames from 'classnames';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import NumberedList from './components/NumberedList';
import ExpandableList from './components/ExpandableList';
import ToggleButton from './components/ToggleButton';
import CardList from './components/CardList';
import * as SideBar from './constants/SideBarItems';
import * as PlaceHolder from './constants/PlaceHolder';

import styles from './css/index.css';

const initialState = {
  paneHidden: false,
  loading: false,
  loadProgress: 0,
};

class App extends React.Component<{}, typeof initialState> {

  constructor(prop) {
    super(prop);
    this.state = initialState;
  }

  public render() {

    return (
        <div>
          <div
              className={
                classnames(styles.paneFolder, { [styles.paneHidden]: this.state.paneHidden })
              }
          >
            <NumberedList
                name="通知汇总"
                icon="thumbtack"
                items={SideBar.SUMMARY_FUNC_LIST}
                numbers={PlaceHolder.TEST_NUMBER_LIST}
            />
            <Divider/>
            <ExpandableList
                name="本学期课程"
                icon="inbox"
                courses={PlaceHolder.TEST_COURSE_LIST}
                functions={SideBar.COURSE_FUNC_LIST}
            />
            <Divider/>
            <NumberedList
                name="设置"
                icon="wrench"
                items={SideBar.SETTINGS_FUNC_LIST}
                numbers={[]}
            />
          </div>
          <div
              className={
                classnames(styles.paneMessage, { [styles.paneHidden]: this.state.paneHidden })
              }
          >
            <CardList
                title="主页"
                items={PlaceHolder.TEST_CARD_INFO_LIST}
            />
          </div>
          <div
              className={
                classnames(styles.paneContent, { [styles.paneFullscreen]: this.state.paneHidden })
              }
          >
            <ToggleButton
                handler={this.toggleButtonHandler}
            />
            <Iframe
                url="welcome.html"
            />
          </div>
          <div className={styles.progress_area}>
            <LinearProgress
                variant="determinate"
                value={this.state.loadProgress}
                hidden={!this.state.loading}
            />
          </div>
        </div>);
  }

  private toggleButtonHandler = () => {
    this.setState({ paneHidden: !this.state.paneHidden });
  }

}

ReactDOM.render(<App />, document.querySelector('#index'));
