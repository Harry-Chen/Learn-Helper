# Changelog

## 4.6.2

- FIX empty course time and location ([#145](https://github.com/Harry-Chen/Learn-Helper/issues/145))
- FIX only inject csrf token in extension tab
- ADD sort homework by submission status ([#148](https://github.com/Harry-Chen/Learn-Helper/issues/148))

## 4.6.1

- Change i18n backend to [Lingui](https://lingui.dev/) and support language switching ([#134](https://github.com/Harry-Chen/Learn-Helper/issues/134))
- FIX csrf injection ([#135](https://github.com/Harry-Chen/Learn-Helper/issues/135))
- Try to FIX PKU course compatibility ([#139](https://github.com/Harry-Chen/Learn-Helper/issues/139))
- FIX open in new window ([#140](https://github.com/Harry-Chen/Learn-Helper/issues/140))
- FIX card list scroll height reset after open item ([AsakuraMizu/Learn-Helper#2](https://github.com/AsakuraMizu/Learn-Helper/issues/2))
- FIX card filter not reset after switching semester ([AsakuraMizu/Learn-Helper#3](https://github.com/AsakuraMizu/Learn-Helper/issues/3))
- Remove fontawesome and use [unplugin-icons](https://github.com/unplugin/unplugin-icons) to render icons, reduce package size

## v4.6.0

(Contributed by @AsakuraMizu as part of OSPP'2023 project)

- REFACTOR React components as functional component and Redux logic with Redux Toolkit, change build toolchain from Webpack to Vite
- MIGRATE to Manifest V3
- ADD dark mode and switcher
- ADD i18n and partial English translations  Due to technical restrictions language can only follow browser config
- Upgrade thu-learn-lib to v3.1.0
- FIX snackbar conflict

## v4.5.1

- Upgrade to latest dependencies (TypeScript 4.6.1, MUI 5.5.2)

## v4.5.0

Note: User data (except configuration) will be **automatically cleared** after upgrade to `v4.5.0` from any previous version due to breaking changes of `thu-learn-lib`.

- FIX problem that notifications might be (occasionally) changed to incorrect publish time (Harry-Chen/thu-learn-lib#36)
- ADD preview frame to homework and notifications (if applicable)
- ADD login status check before triggering bulk download to avoid garbage artifacts
- Upgrade to latest dependencies

## v4.4.3

- FIX problem when opening notification or submitting homework from detail panel (#103)
- FIX problem when certain course has disabled some functionalities of Web Learning (#104)

## v4.4.2

- FIX login error (update to `thu-learn-helper` 2.5.0 to support CSRF token)

## v4.4.1

- FIX possible missing current semester in semester choice dialog
- Upgrade dependencies to mitigate security issues

## v4.4.0

- FIX error when reading data from disabled functionalities (#90)
- ADD more version info on welcome page
- Deploy self-host version of FireFox Addons (see <https://harrychen.xyz/learn/>)
- Upgrade to TypeScript v4.1, Webpack v5.15, React v17, Material-UI v4.11

## v4.3.1

- FIX login error when not saving credentials
- FIX error on first use after upgrade
- ADD refresh button on error page to avoid unnecessary data cleaning
- FIX iframe same-origin problem (probably a Chrome bug) (by Starrah)
- FIX alignment of icons on content cards (bt Starrah)

## v4.3.0

- ADD dialog to change current semester
- ADD link for file preview in detail page (workaround for a Chrome bug)
- FIX sorting function of cards, showing undue homework in deadline order

## v4.2.1

- ADD preview window to the detail page of files
- REMOVE permission of learn2018.tsinghua.edu.cn
- Rewrite welcome page using modern CSS

## v4.2.0

- ADD switch to `preact` and adjust bundle configuration to reduce code size (but also increase the minimal browser version)
- ADD more information in error recovery page
- FIX crash after dropping a course (again)

## v4.1.7

- FIX wrong UI logic when login failed
- ADD more specific error recovery message

## v4.1.6

- FIX inability to login after login failed
- FIX crash triggered by wrong badge counting

## v4.1.5

- FIX scrolling problem of sidebar

## v4.1.4

- FIX crash after dropping courses
- FIX wrong order of undue homework in card list
- FIX ignored homework counting in badges

## v4.1.3

- FIX wrong logic in version migration which clears data at each start

## v4.1.2

- FIX error when loading content from disabled modules of courses
- ADD general handler to clear all data when fatal error occurs

## v4.1.1

- FIX wrong encoding of notifications (caused by `thu-learn-lib`)

## v4.1.0

- ADD conversion to non-numerical grades (A+/B/C/...)
- ADD ignoring of single item, refine the logic of course module hiding
- ADD bulk downloading of unread files
- ADD detailed time in detail pane
- FIX state storing problem in FireFox
- FIX homework not marked as unread after being graded
- FIX garbled text shown in detail pane when notification has empty body
- FIX wrong notice when certain module of course is disabled

## v4.0.3

- FIX bugs in `ContentDetail` and `ContentIgnoreSettings`
- Avoid opening too many instances when clicking on extension icon
- Switch to WebExtension API for file downloading
- Release Firefox version!

## v4.0.2

- FIX whitespace warping problem in detail page
- ADD timeout judgement for login process
- ADD detail page for files

## v4.0.1

- FIX url error in attachment of notification
- FIX too wide detail pane on narrow-screen devices

## v4.0.0

- Rewrite use React (with Material-UI) + Redux
- ADD support for learn2018
- REMOVE support for all other versions
- ADD chrome badge to remind unread message count
- ADD card title filter

## v3.3.1

- FIX discusstion reply bug

## v3.3.0

- ADD discusstion collection
- FIX icon error
- rebuild project, using grunt build completely

## v3.2.3

- FIX display items repeatly when refresh

## v3.2.2

- add installation checking code

## v3.2.0

- hide term-model when first time open
- move to Chrome Web Store

## v3.1.0

- FIX clear div when clearing data
- automaticaly switch to new term

## v3.0.1

- css fix

## v3.0.0

- move all logic to `background.iced`
- auto login after long time no-operation
- do not refresh data when reopen in 5min
- add off-line mode for homework and announcement by adding a cache

## v2.2.1

- bug fixed

## v2.2.0

- FIX wrong href target
- ignore unfinished homework that exceed the time limit

## v2.1.0

- ADD file collection function
- add function to update database smoothly
- ADD changelog page
- FIX bug of displaying course name #4
- FIX unread message number

## v2.0.1

- FIX refresh button bug
- FIX security problem of saved password
- show version info in index page

## v2.0.0

- evernote-like UI
- collect Homework and Announcement
