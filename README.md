# Learn Helper

[![GitHub Action Build](https://github.com/Harry-Chen/Learn-Helper/workflows/Build/badge.svg)](https://github.com/Harry-Chen/Learn-Helper/actions)
[![GitHub release](https://img.shields.io/github/v/release/Harry-Chen/Learn-Helper)](https://github.com/Harry-Chen/Learn-Helper)
[![Chrome Web Store version](https://img.shields.io/chrome-web-store/v/mdehapphdlihjjgkhmoiknmnhcjpjall)](https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall)
![Chrome Web Store users](https://img.shields.io/chrome-web-store/users/mdehapphdlihjjgkhmoiknmnhcjpjall)
![Chrome Web Store rating](https://img.shields.io/chrome-web-store/rating/mdehapphdlihjjgkhmoiknmnhcjpjall)

A browser extension for [Web Learning](https://learn.tsinghua.edu.cn) of Tsinghua University.

## Authors & Maintainers

* [AsakuraMizu](https://github.com/AsakuraMizu)
  * current maintainer
  * developer from v4.6.0
* [Harry-Chen](https://github.com/Harry-Chen)
  * current maintainer
  * developer of v4.0.0 - v4.5.1
* [xxr3376](https://github.com/xxr3376)
  * original author
  * developer till v3.3.1

## Install

[Chrome Store](https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall), [Self-hosted Firefox Add-on](https://harrychen.xyz/learn/), [Edge Addons](https://microsoftedge.microsoft.com/addons/detail/dhddjfhadejlhiaafnbadhaeichbkgil)  

Or you can install the unpacked version from releases.

## License

This project is licensed under the terms of MIT License from version 4.0.3 __EXCLUDING any of the following conditions__:

* You are working / have worked for *Informatization Office* or *Information Technology Center* of Tsinghua University.
* Your project is funded or supported in any way by an affiliate of Tsinghua University or any other institution associated with Tsinghua University.

If any of these criteria is met, any use of code, without explicit authorization from the authors, from this project will be considered as infringement of copyright. The word ‘use’ may refer to making copies of, modifying, redistributing of the source code or derivatives (such as browser extension) of this project, whether or not for commercial use. However you can still install and run the browser extension released by the author without being constrained by this exception.

## 版权说明

本项目从 4.0.3 版本起，依照 MIT License 开源，但 __不包含下列任意情况__：

* 您过去或者目前为清华大学信息化工作办公室或信息化技术中心工作；
* 您的项目受到清华大学的下属机构或其他任何与清华大学有关的机构的任何形式的资助或支持。

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

## Build

Learn Helper is built using `pnpm`:

```bash
pnpm install

# build unpacked
pnpm build:chrome
pnpm build:firefox

# build packed zip
pnpm zip:chrome
pnpm zip:firefox
```

## Development

```bash
pnpm dev
```

Due to technical restrictions, dev mode works only for chrome.

### Auto login

Copy `.env.development` to `.env.development.local` and fill in your username & password to login automatically on start. (development mode only)

## Revision History

See [CHANGELOG.md](https://github.com/Harry-Chen/Learn-Helper/blob/master/CHANGELOG.md).
