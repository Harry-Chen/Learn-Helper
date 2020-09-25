# Changelog

## v4.3.1

* FIX login error when not saving credentials
* FIX error on first use after upgrade
* ADD refresh button on error page to avoid unnecessary data cleaning
* FIX iframe same-origin problem (probably a Chrome bug) (by Starrah)
* FIX alignment of icons on content cards (bt Starrah)

## v4.3.0

* ADD dialog to change current semester
* ADD link for file preview in detail page (workaround for a Chrome bug)
* FIX sorting function of cards, showing undue homework in deadline order

## v4.2.1

* ADD preview window to the detail page of files
* REMOVE permission of learn2018.tsinghua.edu.cn
* Rewrite welcome page using modern CSS

## v4.2.0

* ADD switch to `preact` and adjust bundle configuration to reduce code size (but also increase the minimal browser version)
* ADD more information in error recovery page
* FIX crash after dropping a course (again)

## v4.1.7

* FIX wrong UI logic when login failed
* ADD more specific error recovery message

## v4.1.6

* FIX inability to login after login failed
* FIX crash triggered by wrong badge counting

## v4.1.5

* FIX scrolling problem of sidebar

## v4.1.4

* FIX crash after dropping courses
* FIX wrong order of undue homework in card list
* FIX ignored homework counting in badges

## v4.1.3

* FIX wrong logic in version migration which clears data at each start

## v4.1.2

* FIX error when loading content from disabled modules of courses
* ADD general handler to clear all data when fatal error occurs

## v4.1.1

* FIX wrong encoding of notifications (caused by `thu-learn-lib`)

## v4.1.0

* ADD conversion to non-numerical grades (A+/B/C/...)
* ADD ignoring of single item, refine the logic of course module hiding
* ADD bulk downloading of unread files
* ADD detailed time in detail pane
* FIX state storing problem in FireFox
* FIX homework not marked as unread after being graded
* FIX garbled text shown in detail pane when notification has empty body
* FIX wrong notice when certain module of course is disabled

## v4.0.3

* FIX bugs in `ContentDetail` and `ContentIgnoreSettings`
* Avoid opening too many instances when clicking on extension icon
* Switch to WebExtension API for file downloading
* Release Firefox version!

## v4.0.2

* FIX whitespace warping problem in detail page
* ADD timeout judgement for login process
* ADD detail page for files

## v4.0.1

* FIX url error in attachment of notification
* FIX too wide detail pane on narrow-screen devices

## v4.0.0

* Rewrite use React (with Material-UI) + Redux
* ADD support for learn2018
* REMOVE support for all other versions
* ADD chrome badge to remind unread message count
* ADD card title filter

## v3.3.1

* FIX discusstion reply bug

## v3.3.0

* ADD discusstion collection
* FIX icon error
* rebuild project, using grunt build completely

## v3.2.3

* FIX display items repeatly when refresh

## v3.2.2

* add installation checking code

## v3.2.0

* hide term-model when first time open
* move to Chrome Web Store

## v3.1.0

* FIX clear div when clearing data
* automaticaly switch to new term

## v3.0.1

* css fix

## v3.0.0

* move all logic to `background.iced`
* auto login after long time no-operation
* do not refresh data when reopen in 5min
* add off-line mode for homework and announcement by adding a cache

## v2.2.1

* bug fixed

## v2.2.0

* FIX wrong href target
* ignore unfinished homework that exceed the time limit

## v2.1.0

* ADD file collection function
* add function to update database smoothly
* ADD changelog page
* FIX bug of displaying course name #4
* FIX unread message number

## v2.0.1

* FIX refresh button bug
* FIX security problem of saved password
* show version info in index page

## v2.0.0

* evernote-like UI
* collect Homework and Announcement
