  define ['./app'], (app) ->
    Route = app.config(['$routeProvider', '$httpProvider',
      ($routeProvider) ->
        $routeProvider
          .when('/', {
            templateUrl: 'partials/main.html'
            controller: 'MainCtrl'
          }).otherwise rediectTo: '/'
    ])
    return Route

