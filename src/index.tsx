import React from 'react';
import ReactDOM from 'react-dom';
import Iframe from 'react-iframe'
import { Divider } from '@material-ui/core';

import './css/main.css';
import NumberedList from './components/NumberedList';
import ExpandableList from './components/ExpandableList';
import { COURSE_FUNC_LIST, SETTINGS_FUNC_LIST, SUMMARY_FUNC_LIST } from './utils/SideBarItems';

const TEST_COURSE_LIST = [
  {
    icon: 'home',
    name: '测试',
  },  {
    icon: 'home',
    name: '测试2',
  },
];

const App = () => {
  return (
      <div>
        <div className="pane-folder">
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
        <div className="pane-message" id="pane-message"/>
        <div className="pane-content" id="pane-content">
          <Iframe
              url="welcome.html"
          />
        </div>
      </div>);
};

ReactDOM.render(<App />, document.querySelector('#index'));
