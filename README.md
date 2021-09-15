# Learn Helper

[![GitHub Action Build](https://github.com/Harry-Chen/Learn-Helper/workflows/Build/badge.svg)](https://github.com/Harry-Chen/Learn-Helper/actions)
[![GitHub release](https://img.shields.io/github/v/release/Harry-Chen/Learn-Helper)](https://github.com/Harry-Chen/Learn-Helper)
[![Chrome Web Store version](https://img.shields.io/chrome-web-store/v/mdehapphdlihjjgkhmoiknmnhcjpjall)](https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall)
[![Mozilla Addon version](https://img.shields.io/amo/v/thu-learn-helper)](https://addons.mozilla.org/zh-CN/firefox/addon/thu-learn-helper/)
![Chrome Web Store users](https://img.shields.io/chrome-web-store/users/mdehapphdlihjjgkhmoiknmnhcjpjall)

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

[Chrome Store](https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall), [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/thu-learn-helper/), [Edge Addons](https://microsoftedge.microsoft.com/addons/detail/dhddjfhadejlhiaafnbadhaeichbkgil)  

Or you can install the unpacked version from releases

## Build

Learn Helper is built using `yarn`:

```bash
yarn --frozen-lockfile
yarn dev-build # for development build
yarn dev-watch # for development build with watching
yarn format # run prettier
yarn build # for release build
```

You may need to run build commands more than once to get the correct output.
The compiled Chrome plugin is in `dist/` (unpacked).

## Revision History

See [CHANGELOG.md](https://github.com/Harry-Chen/Learn-Helper/blob/master/CHANGELOG.md).
