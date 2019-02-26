# Learn Helper

A Chrome extension for [Web Learning](https://learn.tsinghua.edu.cn) of Tsinghua University.

## Authors & Maintainers

* [Harry-Chen](https://github.com/Harry-Chen)
  * current maintainer
  * developer from v4.0.0
* [xxr3376](https://github.com/xxr3376)
  * original author
  * developer till v3.3.1

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

## Install (Chrome Plugin)

Use chrome store link: https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall

## Build

Learn Helper is built using npm
```bash
npm install
npm run dev-build # for develop build
npm run dev-watch # for develop build with watching
npm run format # run prettier
npm run build # for release build
```

You may need to run build commands more than once to get the correct output.
The compiled Chrome plugin is in `dist/` (unpacked).

Use `npm run dev-server` to watch changes in `src/` and start Webpack Dev Server.

## Revision History

**v4.0.3**
* FIX bugs in `ContentDetail` and `ContentIgnoreSettings`
* Avoid opening too many instances when clicking on extension icon
* Switch to WebExtension API for file downloading

**v4.0.2**
* FIX whitespace warping problem in detail page
* ADD timeout judgement for login process
* ADD detail page for files

**v4.0.1**
* FIX url error in attachment of notification
* FIX too wide detail pane on narrow-screen devices

**v4.0.0**
* Rewrite use React (with Material-UI) + Redux
* ADD support for learn2018
* REMOVE support for all other versions
* ADD chrome badge to remind unread message count
* ADD card title filter

**v3.3.1**
* FIX discusstion reply bug

**v3.3.0**
* ADD discusstion collection
* FIX icon error
* rebuild project, using grunt build completely

**v3.2.3**
* FIX display items repeatly when refresh

**v3.2.2**
* add installation checking code

**v3.2.0**
* hide term-model when first time open
* move to Chrome Web Store

**v3.1.0**
* FIX clear div when clearing data
* automaticaly switch to new term

**v3.0.1**
* css fix

**v3.0.0**
* move all logic to `background.iced`
* auto login after long time no-operation
* do not refresh data when reopen in 5min
* add off-line mode for homework and announcement by adding a cache

**v2.2.1**
* bug fixed

**v2.2.0**
* FIX wrong href target
* ignore unfinished homework that exceed the time limit

**v2.1.0**
* ADD file collection function
* add function to update database smoothly
* ADD changelog page
* FIX bug of displaying course name #4
* FIX unread message number

**v2.0.1**
* FIX refresh button bug
* FIX security problem of saved password
* show version info in index page

**v2.0.0**
* evernote-like UI
* collect Homework and Announcement
