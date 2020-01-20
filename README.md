# Learn Helper

![GitHub version](https://img.shields.io/github/package-json/v/xxr3376/Learn-Project)
![Chrome Web Store version](https://img.shields.io/chrome-web-store/v/mdehapphdlihjjgkhmoiknmnhcjpjall)
![Mozilla Addon version](https://img.shields.io/amo/v/thu-learn-helper)
![Chrome Web Store users](https://img.shields.io/chrome-web-store/users/mdehapphdlihjjgkhmoiknmnhcjpjall)
![Chrome Web Store rating](https://img.shields.io/chrome-web-store/stars/mdehapphdlihjjgkhmoiknmnhcjpjall)


A browser extension for [Web Learning](https://learn.tsinghua.edu.cn) of Tsinghua University.

## Authors & Maintainers

* [Harry-Chen](https://github.com/Harry-Chen)
  * current maintainer
  * developer from v4.0.0
* [xxr3376](https://github.com/xxr3376)
  * original author
  * developer till v3.3.1

## License

This project is licensed under the terms of MIT License from version 4.0.3 for any condition __EXCLUDING__:

* You are working / have worked for Computer and Information Manage Center, Tsinghua University.
* Your project is financially supported by any institute in relation to Tsinghua University.

If any of these criteria is met, any usage of code, without explicit authorization from the authors,  from this project will be considered as infringement of copyright. The word ‘usage’ may refer to making copies of, modifying, redistributing of the source code or derivatives (such as browser extension) of this project, for either commercial or non-commercial use. However you can still install and run the browser extension released by the author without being constrained by this exception.

## 版权说明

本项目从 4.0.3 版本起，依照 MIT License 开源，但__不包含__下列情况：

* 您过去或者目前为清华大学信息化技术中心工作
* 您的项目受到任何与清华大学有关的机构的经济资助

如果上述任意条件成立，任何未经授权的对本项目中代码的使用将会被认为是侵权。上文中的“使用”包括对项目的源代码或衍生品（如浏览器插件）制作拷贝、修改、重分发，无论是否用作商业用途。但安装并运行作者发布的浏览器插件的行为不受此例外约束。

## Features

* provide a Evernote-like materialized UI
* collect all data of Web Learning
  * Homework
  * Notification
  * File
  * Discussion
  * Question
* provide new message reminder and highlight messages
* provide a `Priority Inbox` like Gmail
* provide a off-line mode, cache all message that you have already read

## Install

[Chrome Store](https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall), [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/thu-learn-helper/)  

Or you can install the unpacked version from releases

## Build

Learn Helper is built using `yarn`:

```bash
yarn
yarn dev-build # for develop build
yarn dev-watch # for develop build with watching
yarn format # run prettier
yarn build # for release build
```

You may need to run build commands more than once to get the correct output.
The compiled Chrome plugin is in `dist/` (unpacked).

Use `yarn run dev-server` to watch changes in `src/` and start Webpack Dev Server.

## Revision History

### v4.1.5

* FIX scrolling problem of sidebar

### v4.1.4

* FIX crash after dropping courses
* FIX wrong order of undue homework in card list
* FIX ignored homework counting in badges

### v4.1.3

* FIX wrong logic in version migration which clears data at each start

### v4.1.2

* FIX error when loading content from disabled modules of courses
* ADD general handler to clear all data when fatal error occurs

### v4.1.1

* FIX wrong encoding of notifications (caused by `thu-learn-lib`)

### v4.1.0

* ADD conversion to non-numerical grades (A+/B/C/...)
* ADD ignoring of single item, refine the logic of course module hiding
* ADD bulk downloading of unread files
* ADD detailed time in detail pane
* FIX state storing problem in FireFox
* FIX homework not marked as unread after being graded
* FIX garbled text shown in detail pane when notification has empty body
* FIX wrong notice when certain module of course is disabled

### v4.0.3

* FIX bugs in `ContentDetail` and `ContentIgnoreSettings`
* Avoid opening too many instances when clicking on extension icon
* Switch to WebExtension API for file downloading
* Release Firefox version!

### v4.0.2

* FIX whitespace warping problem in detail page
* ADD timeout judgement for login process
* ADD detail page for files

### v4.0.1

* FIX url error in attachment of notification
* FIX too wide detail pane on narrow-screen devices

### v4.0.0

* Rewrite use React (with Material-UI) + Redux
* ADD support for learn2018
* REMOVE support for all other versions
* ADD chrome badge to remind unread message count
* ADD card title filter

### v3.3.1

* FIX discusstion reply bug

### v3.3.0

* ADD discusstion collection
* FIX icon error
* rebuild project, using grunt build completely

### v3.2.3

* FIX display items repeatly when refresh

### v3.2.2

* add installation checking code

### v3.2.0

* hide term-model when first time open
* move to Chrome Web Store

### v3.1.0

* FIX clear div when clearing data
* automaticaly switch to new term

### v3.0.1

* css fix

### v3.0.0

* move all logic to `background.iced`
* auto login after long time no-operation
* do not refresh data when reopen in 5min
* add off-line mode for homework and announcement by adding a cache

### v2.2.1

* bug fixed

### v2.2.0

* FIX wrong href target
* ignore unfinished homework that exceed the time limit

### v2.1.0

* ADD file collection function
* add function to update database smoothly
* ADD changelog page
* FIX bug of displaying course name #4
* FIX unread message number

### v2.0.1

* FIX refresh button bug
* FIX security problem of saved password
* show version info in index page

### v2.0.0

* evernote-like UI
* collect Homework and Announcement
