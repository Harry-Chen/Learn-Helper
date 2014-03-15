define [
  'angular'
  'angular-route'
  './controllers'
  './services'
], (angular) ->
  app = angular.module 'LearnHelper', [
    'ngRoute'
    'MainControllers'
    'BackgroundServices'
  ]
  app.config ['$compileProvider', ($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/)
  ]

  app.directive('lhItem', ['LHAPI', (LHAPI) ->
    return {
      require: 'ngModel'
      scope:
        info: "=ngModel"
      restrict: 'E'
      templateUrl: 'partials/item.html'
      replace: true
      link: (scope, element, attrs) ->
        setState = () ->
          info = scope.info
          (LHAPI 'setState', info.type, info.id, info.state)
          return
        scope.read = () ->
          console.log scope.info.state
          if scope.info.state == 'new'
            scope.info.state = 'old'
          setState()
        scope.top = () ->
          switch scope.info.state
            when 'stared' then scope.info.state = 'old'
            else
              scope.info.state = 'stared'
          setState()
    }
  ])
  app.directive('modalDialog', ->
    return {
      restrict: 'E'
      scope:
        show: '='
        title: '='
        icon: '='
      replace: true
      transclude: true
      link: (scope, element, attrs) ->
        scope.dialogStyle = {}
        if attrs.width
          scope.dialogStyle.width = attrs.width
        if attrs.height
          scope.dialogStyle.height = attrs.height
        scope.hideModal = ->
          scope.show = false
      templateUrl: 'partials/modal.html'
    }
  )
  return app
