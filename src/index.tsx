import React from 'react';
import ReactDOM from 'react-dom';

import './css/main.css';
import NumberedList from './components/NumberedList';
import { Divider } from '@material-ui/core';
import ExpandableList from './components/ExpandableList';

const SUMMARY_AREA = [
  {
    icon: 'home',
    name: 'home',
    title: '主页',
  },  {
    icon: 'pencil-alt',
    name: 'homework',
    title: '所有作业',
    number: '0',
  },  {
    icon: 'bullhorn',
    name: 'notifications',
    title: '所有通知',
    number: '0',
  },  {
    icon: 'download',
    name: 'files',
    title: '所有文件',
    number: '0',
  },  {
    icon: 'question',
    name: 'discussions',
    title: '所有讨论',
    number: '0',
  },
];

const COURSE_LIST = [
  {
    icon: 'home',
    name: '测试',
  },  {
    icon: 'home',
    name: '测试2',
  },
];

const COURSE_SUB_FUNC = [
  {
    name: 'homework',
    icon: 'pencil-alt',
    title: '课程作业',
  },  {
    name: 'notification',
    icon: 'pencil-alt',
    title: '课程通知',
  }
];

const App = () => (
  <div>
      <div className="pane-folder">
        <NumberedList name="通知汇总" icon="thumbtack" items={SUMMARY_AREA}/>
        <Divider />
        <ExpandableList name="本学期课程" icon="inbox" items={COURSE_LIST} subitems={COURSE_SUB_FUNC}/>
      </div>
      <div className="pane-message" id="pane-message"/>
      <div className="pane-content" id="pane-content"/>
  </div>);

ReactDOM.render(<App />, document.querySelector('#index'));
