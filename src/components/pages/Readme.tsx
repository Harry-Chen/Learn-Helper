import React from 'react';
import classNames from 'classnames';

import { useAppDispatch } from '../../redux/hooks';

import styles from '../../css/doc.module.css';
import imgNewItem from '../../image/new_item.png';
import imgStarredItem from '../../image/starred_item.png';
import imgHomeworkSubmitted from '../../image/homework_submitted.png';
import imgHomeworkExpired from '../../image/homework_expired.png';
import imgFile from '../../image/file.png';
import imgSwitchFilter from '../../image/switch_filter.png';
import imgSwitchCourse from '../../image/switch_course.png';
import imgTitleFilter from '../../image/title_filter.png';
import imgSettings1 from '../../image/settings_1.png';
import imgSettings2 from '../../image/settings_2.png';
import { setDetailPage } from '../../redux/actions';

const Readme = () => {
  const dispatch = useAppDispatch();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <h1>使用手册</h1>
        <div className={styles.doc_image_block}>
          <img src={imgNewItem} alt="New Item" />
          <div className={styles.doc_image_block_text}>
            <h2>未读项目</h2>
            新的项目会出现在列表顶部，红色的点表示未读。这是一份新作业，标有剩余天数。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgStarredItem} alt="Starred Item" />
          <div className={styles.doc_image_block_text}>
            <h2>星标项目</h2>
            加星标的项目会始终保持在列表顶部。这是一条加星的通知，点即可进入详情。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgHomeworkSubmitted} alt="Homework Submitted" />
          <div className={styles.doc_image_block_text}>
            <h2>作业提示</h2>
            有红、橙、蓝三种颜色对应剩余时间，左下角有提交按钮。已交的作业是绿色的勾。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgHomeworkExpired} alt="Homework Expired" />
          <div className={styles.doc_image_block_text}>
            <h2>截止作业</h2>
            过了截止日期的作业是灰色的笔或者勾，会显示提交和批阅状态（分数和评阅人）。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgFile} alt="File" />
          <div className={styles.doc_image_block_text}>
            <h2>课程文件</h2>
            点击标题即可下载文件，也可直接标记为已读（不同步到网络学堂）。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgSwitchFilter} alt="Switch Filter" />
          <div className={styles.doc_image_block_text}>
            <h2>切换内容</h2>
            在左上角可以切换查看各项信息的总览面板，角标是未读数量。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgSwitchCourse} alt="Switch Course" />
          <div className={styles.doc_image_block_text}>
            <h2>切换课程</h2>
            点击左侧课程名字，可以查看该课程的各项内容，或者打开课程主页。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgTitleFilter} alt="Title Filter" />
          <div className={styles.doc_image_block_text}>
            <h2>卡片过滤</h2>
            使用过滤器，轻松地在成百上千个卡片中找到你要的那一个。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgSettings1} alt="Settings 1" />
          <div className={styles.doc_image_block_text}>
            <h2>插件设置</h2>
            可以隐藏某些课程的部分内容以免刷屏，也贴心地提供了一键解决强迫症的功能。
          </div>
        </div>

        <div className={styles.doc_image_block}>
          <img src={imgSettings2} alt="Settings 2" />
          <div className={styles.doc_image_block_text}>
            <h2>其他设置</h2>
            遇到错误不妨试一下，强制刷新、清空缓存、退出登录，总有一个适合你！
          </div>
        </div>
        <button className={styles.doc_back_link} onClick={() => dispatch(setDetailPage('welcome'))}>
          返回
        </button>
      </div>
    </main>
  );
};

export default Readme;
