import React from 'react';
import ReactDOM from 'react-dom';
import Iframe from 'react-iframe'
import { Divider } from '@material-ui/core';

import './css/main.css';
import NumberedList from './components/NumberedList';
import ExpandableList from './components/ExpandableList';
import { COURSE_FUNC_LIST, SETTINGS_FUNC_LIST, SUMMARY_FUNC_LIST } from './utils/SideBarItems';
import ToggleButton from './components/ToggleButton';

const TEST_COURSE_LIST = [
  {
    icon: 'home',
    name: '测试',
  },  {
    icon: 'home',
    name: '测试2',
  },
];

class App extends React.Component<any, any> {

  constructor(prop) {
    super(prop);
    this.state = {
      paneHidden: false,
    };
  }

  public render() {

    const folderClass = ['pane-folder'];
    const messageClass = ['pane-message'];
    const contentClass = ['pane-content'];

    if (this.state.paneHidden) {
      folderClass.push('pane-hidden');
      messageClass.push('pane-hidden');
      contentClass.push('pane-content-fullscreen');
    }

    return (
        <div>
          <div className={folderClass.join(' ')}>
            <NumberedList
                name="通知汇总"
                icon="thumbtack"
                items={SUMMARY_FUNC_LIST}
                numbers={{}}
            />
            <Divider/>
            <ExpandableList
                name="本学期课程"
                icon="inbox"
                items={TEST_COURSE_LIST}
                subitems={COURSE_FUNC_LIST}
            />
            <Divider/>
            <NumberedList
                name="设置"
                icon="wrench"
                items={SETTINGS_FUNC_LIST}
                numbers={{}}
            />
          </div>
          <div className={messageClass.join(' ')} id="pane-message"/>
          <div className={contentClass.join(' ')} id="pane-content">
            <ToggleButton
                handler={this.toggleButtonHandler}
            />
            <Iframe
                url="welcome.html"
            />
          </div>
        </div>);
  }

  private toggleButtonHandler = () => {
    this.setState({ paneHidden: !this.state.paneHidden });
  }

}

ReactDOM.render(<App />, document.querySelector('#index'));
