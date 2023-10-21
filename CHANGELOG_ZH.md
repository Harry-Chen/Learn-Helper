# 更新记录

## 4.6.2

- [FIX] 修复课程时间地点为空时无法获取课程信息 ([#145](https://github.com/Harry-Chen/Learn-Helper/issues/145))
- [FIX] 只在插件页面注入 csrf 以免影响网络学堂正常使用
- [ADD] 作业列表优先显示未完成作业 ([#148](https://github.com/Harry-Chen/Learn-Helper/issues/148))

## 4.6.1

- [FIX] 更换 i18n 后端，支持切换语言 ([#134](https://github.com/Harry-Chen/Learn-Helper/issues/134))
- [FIX] csrf 注入失败导致无法提交作业等问题 ([#135](https://github.com/Harry-Chen/Learn-Helper/issues/135))
- [FIX] 尝试修复北大课程兼容 ([#139](https://github.com/Harry-Chen/Learn-Helper/issues/139))
- [FIX] 无法正确在新窗口打开 ([#140](https://github.com/Harry-Chen/Learn-Helper/issues/140))
- [FIX] 打开项目后滚动重置 ([AsakuraMizu/Learn-Helper#2](https://github.com/AsakuraMizu/Learn-Helper/issues/2))
- [FIX] 切换学期后过滤未重置 ([AsakuraMizu/Learn-Helper#3](https://github.com/AsakuraMizu/Learn-Helper/issues/3))
- [FIX] 移除 fontawesome，使用 [unplugin-icons](https://github.com/unplugin/unplugin-icons) 渲染图标，减小包体积

## 4.6.0

（由 @AsakuraMizu 作为 2023 年 OSPP 项目贡献）

- [REFACTOR] 切换工具链为 Vite，重构了 React 组件和 Redux 逻辑，增加项目可维护性
- [ADD] 全面迁移为 Manifest V3，支持 Chrome / Firefox
- [ADD] 添加暗色模式，支持跟随系统或手动设置
- [ADD] 国际化支持，添加了英文翻译（部分，待校对） 由于技术限制，语言跟随浏览器，暂不可切换
- [ADD] 升级 thu-learn-lib v3.1.0
- [FIX] snackbar 有多条消息时只显示最后一条

## 4.5.1

- [ADD] 升级到 TypeScript v4.3.6，MUI v5.5.2（界面风格略有变化）

## 4.5.0

- [FIX] 升级到最新版本依赖。由于 thu-learn-lib 的改动， **此版本升级将会自动清空数据** ，敬请理解
- [FIX] 修复公告发布时间在刷新后可能错误变化的问题
- [ADD] 为公告和作业添加文件预览（#109）
- [ADD] 在开始批量下载前检查登录状态，防止获得大量垃圾文件

## 4.4.3

- [FIX] 修复无法打开公告页面、无法提交作业的问题（#103），感谢喵喵！
- [FIX] 修复课程关闭部分功能时无法获取数据的问题（#104）

## 4.4.2

- [FIX] 紧急修复无法登录的问题（升级到最新版 thu-learn-lib 以支持网络学堂的 CSRF token）

## 4.4.1

- [FIX] 修复切换学期对话框中可能没有网络学堂当前学期的问题（#92）
- [ADD] 升级依赖以增强安全性

## 4.4.0

- [FIX] 修复读取课程关闭的功能时发生的错误（#90）
- [ADD] 在欢迎页面添加更多版本信息
- [ADD] 由于 FireFox Addons 下架，部署私有版本（见 [此页面](https://harrychen.xyz/learn/) ）
- [ADD] 升级到 TypeScript v4.1, Webpack v5.15, React v17, Material-UI v4.11

## 4.3.1

- [FIX] 修复不选择保存密码无法正常使用的问题
- [FIX] 修复版本升级后首次启动时报错的问题
- [ADD] 在错误页面增加刷新提示，避免在非必要情况下清除数据
- [FIX] 绕过（由于 Chrome bug 导致的）嵌入的网络学堂页面无法正常打开的问题（by Starrah）
- [FIX] 修复作业图标不对齐的问题（by Starrah）

## 4.3.0

- [ADD] 添加切换学期功能
- [ADD] 添加文件预览查看链接（绕过 Chrome bug）
- [FIX] 对于尚未到期的作业，按照 deadline 从早到晚排序

## 4.2.1

- [ADD] 在文件详情中添加预览（仅限于支持的格式）
- [DEL] 移除对 learn2018.tsinghua.edu.cn 的权限要求
- [FIX] 使用现代 HTML 重写欢迎页面

## 4.2.0

- [ADD] 切换到 preact，减少代码体积，提升最低 Chrome 版本
- [ADD] 在错误恢复页面添加更多信息
- [FIX] 修复另一个退课后崩溃的问题

## 4.1.7

- [FIX] 修复登录失败后的 UI 逻辑
- [ADD] 在错误恢复页面中增加更多信息

## 4.1.6

- [FIX] 修复登录失败后登录对话框状态问题
- [FIX] 修复侧边栏计数导致的插件崩溃问题

## 4.1.5

- [FIX] 修复侧边栏无法独立滚动问题

## 4.1.4

- [FIX] 修复退课导致插件崩溃的问题
- [FIX] 修复未截止作业排序混乱的问题
- [FIX] 不再将被忽略的作业计入统计数量中

## 4.1.3

- [FIX] 修复导致每次启动时数据被清除的错误的版本迁移逻辑

## 4.1.2

- [FIX] 修复课程模块被关闭时加载失败的问题
- [FIX] 修复取消切换学期导致插件错误的问题
- [ADD] 增加致命错误恢复功能

## 4.1.1

- [FIX] 紧急修复课程公告编码错误的问题

## 4.1.0

- [ADD] 增加非百分制的作业成绩显示
- [ADD] 允许忽略单个任意项目，完善隐藏课程模块逻辑
- [ADD] 增加未读文件批量下载功能
- [ADD] 在详情面板中显示详细时间
- [FIX] 修复在 FireFox 中无法存储状态的问题
- [FIX] 在作业被评阅后标记为未读，在 DDL 前将未完成作业置顶显示
- [FIX] 修复公告内容为空时显示乱码的问题
- [FIX] 修复错误提示，增加在老师关闭课程模块时的提醒

## 4.0.3

- [FIX] 修复点击图标重复打开页面的问题
- [FIX] 修复打开详情页面崩溃的问题
- [FIX] 修复退课后管理忽略项崩溃的问题
- [FIX] 修复 FireFox 中文件下载问题

## 4.0.2

- [ADD] 为文件添加详情页面(by gjz010)
- [ADD] 添加登录超时判断，减少等待时间
- [FIX] 修复详情页面中的空格问题

## 4.0.1

- [FIX] 修复公告中附件下载链接错误问题(by zhaoxh16)
- [FIX] 修复过窄屏幕上详情面板宽度问题

## 4.0.0

（为 2018 版网络学堂完全重写 by Harry Chen）

- [ADD] 使用 React 进行前后端分离
- [ADD] 界面部分 Material 化
- [ADD] 增加课程答疑模块
- [ADD] 增加 Chrome 插件徽章显示未读数量
- [ADD] 增加卡片标签过滤功能

## 3.5.3

- [ADD] 可以折叠侧边栏以适应低分辨率屏幕(by yaoht)

## 3.5.2

- [FIX] 新版网络学堂登陆问题(by yaoht)

## 3.5.0

- [ADD] 初步支持新版网络学堂(by moreD)

## 3.4.0

- [FIX] 移除新版学堂课程，保证旧版可以正常使用

## 3.3.1

- [FIX] 讨论区无法回复

## 3.3.0

- [ADD] 添加讨论区提醒功能
- [FIX] 功能板块图标错误
- [FIX] 开发目录结构重构

## 3.2.3

- [FIX] 修复强制刷新后重复显示 item

## 3.2.2

- [ADD] 迁移到 Chrome 商店，添加安装检测代码

## 3.2

- [FIX] 修复首次打开时显示学期切换窗口
- [FIX] 简化前后台交互及弹出方式
- [ADD] 整体迁移至 Chrome Web Store，升级地址修改

## 3.1

- [FIX] 修复清空数据时不清空课程列表问题
- [ADD] 自动判断学期切换

## 3.0.1

- [FIX] 修复网络学堂官方修复标签所带来的副作用，使标签背景有效

## 3.0

- [ADD] 增加对公告页面的格式修正，保证换行能正常显示
- [ADD] 逻辑前后台拆分，提高性能
- [FIX] 若干点击之后的显示更新问题
- [ADD] 长时间未使用后，自动登录功能（无需刷新）
- [ADD] 5 分钟内重复进入系统，不进行刷新（减轻服务器压力）
- [ADD] 通知、作业的离线缓存功能

## 2.2.1

- [FIX] 合并函数时遗留的作业已读无效 bug

## 2.2

- [FIX] 查看批阅打开 Target 错误
- [FIX] 简化显示逻辑，合并函数
- [FIX] 未完成作业算上已过期错误
- [ADD] 增加作业计数上传

## 2.1

- [ADD] 查找课程文件功能
- [FIX] 添加数据库升级函数
- [ADD] Changelog 页面
- [FIX] 含括号课程名显示 bug, ISSUE 4
- [FIX] 未读信息数量显示 bug

## 2.0.1

- [FIX] 修复了更换用户后「刷新」无用，必须「强制刷新」然后再「刷新」方能生效的问题
- [FIX] 修复了 localStroage 的安全性问题
- [ADD] Version 信息

## 2.0

- 新版本推出
