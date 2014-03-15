require.config(
  baseUrl: '/js'
  urlArgs: 'v=' + Date.now()
  paths:
    jquery: 'vendor/jquery-2.1.0.min'
    q: 'vendor/q'
    underscore: 'vendor/underscore-min'
    angular: 'vendor/angular/angular'
    'angular-route': 'vendor/angular/angular-route'
    domReady: 'vendor/domReady'
    sjcl: 'vendor/sjcl.min'
  shim:
    angular:
      exports: 'angular'
    'angular-route':
      deps: ['angular']
    sjcl:
      exports: 'sjcl'
)
