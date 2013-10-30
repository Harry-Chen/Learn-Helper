# Learn Helper

a chrome extension for Web Learning Website.

## Features
* provide a evernote-like UI
* collect all data of Web Learning
	* Homework
	* Announcement
	* File
	* Discussion
* provide new message reminder and highlight messages
* provide a `Priority Inbox` like gmail
* provide a off-line mode, cache all message that you have already readed

## Install (Chrome Plugin)
Use chrome store link: https://chrome.google.com/webstore/detail/learn-helper/mdehapphdlihjjgkhmoiknmnhcjpjall

If you can't open the link above for some reason, you can try this link: http://thudev.sinaapp.com/learn

## Build
Learn Helper is built using [Grunt][]
```
npm install
grunt
```

Chrome plugin is in `build/` (unpacked)

Use `grunt dev` to watch changes in `src/`

[Grunt]: http://gruntjs.com/

## Revision History

** v3.3.1 **
* FIX discusstion reply bug

** v3.3.0 **
* ADD discusstion collection
* FIX icon error
* rebuild project, using grunt build completely

** v3.2.3 **
* FIX display items repeatly when refresh

** v3.2.2 **
* add installation checking code

** v3.2.0 **
* hide term-model when first time open
* move to Chrome Web Store

** v3.1.0 **
* FIX clear div when clearing data
* automaticaly switch to new term

** v3.0.1 **
* css fix

** v3.0.0 **
* move all logic to `background.iced`
* auto login after long time no-operation
* do not refresh data when reopen in 5min
* add off-line mode for homework and announcement by adding a cache

** v2.2.1 **
* bug fixed

** v2.2.0 **
* FIX wrong href target
* ignore unfinished homework that exceed the time limit

** v2.1.0 **
* ADD file collection function
* add function to update database smoothly
* ADD changelog page
* FIX bug of displaying course name #4
* FIX unread message number

** v2.0.1 **
* FIX refresh button bug
* FIX security problem of saved password
* show version info in index page

** v2.0.0 **
* evernote-like UI
* collect Homework and Announcement
