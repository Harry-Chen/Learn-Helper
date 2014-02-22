define [
  'require'
  'angular'
  './app'
  './route'
], (require, ng) ->
  require(['domReady!'], (document) ->
    ng.bootstrap(document, ['LearnHelper'])
  )
