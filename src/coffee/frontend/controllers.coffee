define [
  'angular'
], (angular) ->
  mainControllers = angular.module 'MainControllers', []


  mainControllers.controller('MainCtrl', ['$scope', 'LHAPI',
    ($scope, LHAPI) ->
      $scope.menuClick = (item) ->
        final = !item.show
        for k, course of $scope.courses
          course.show = false
        item.show = final
        return

      $scope.readAll = ->
        $scope.done = false
        (LHAPI 'readAll').then ->
          (LHAPI 'getItems', false)
            .then( (items) ->
              $scope.done = true
              $scope.items = items
          )
      $scope.reload = ->
        $scope.done = false
        (LHAPI 'getItems', true)
          .then( (items) ->
            $scope.done = true
            $scope.items = items
        )
        return
      $scope.clearAll = ->
        $scope.done = false
        (LHAPI 'clearCache').then( ->
          (LHAPI 'getItems', false)
              .then( (items) ->
                $scope.done = true
                $scope.items = items
          )
        )
        return
      $scope.token = {}
      $scope.setToken = ->
        $scope.token['loading'] = true
        t = $scope.token
        (LHAPI 'changeToken', t.username, t.password)
          .then
        console.log $scope.token

      ###
      (LHAPI 'getCourseList', false)
        .then( (courses) ->
          for k, v in courses
            v.show = false
          $scope.courses = courses
          return
        )

      (LHAPI 'getItems', false)
        .then( (items) ->
          $scope.done = true
          $scope.items = items
          return
      )
      ###
      $scope.showModal = true
      return
  ])
