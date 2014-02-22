define [
  'angular'
], (angular) ->
  services = angular.module 'BackgroundServices', []

  services.factory 'LHAPI', ['$q', ($q) ->
    LHAPI = (funcName, args...) ->
      console.log arguments
      deferred = $q.defer()
      chrome.extension.sendMessage(
        type: 'func'
        func: funcName
        args: args
        (response) ->
          if response.err == null
            deferred.resolve response.ret
          else
            deferred.reject response.err
      )
      return deferred.promise
    return LHAPI
  ]
