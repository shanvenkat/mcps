/*
 * Register angular module with custom name myapp, all other Angular objects will add it to this custom angular module, 
 * Here Other Anulag objects used are Controller, Service, RouteProvider etc.
 **/

// TODO: standardize module and function descriptions, maybe using jsdoc

'use strict';

var myapp = angular.module('myapp', [
  'angular.css.injector',
  'mcfp.Overlay',
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'ngSanitize',
  'ngDropdowns',
  'ui.bootstrap'
])

// Description: This service is a super cache and a data management service.
// It is initialized with the data we will need to load the initial view in main.js
// Other data can be dynamically loaded, and everything will be cached in the inspectable oMiCache object
// It is a $cacheFactory instance, so the keys can be URLs or arbitrary strings.
//
// use $http.get(sDataKey) to get urls or constants and MiData.put() to add constants
// angular is so backwards...factories are functional and services actually invoke Object.create() (like an OOP/Java Factory)
.service('MiData', ['$cacheFactory', '$http', function($cacheFactory, $http){
  var _oMiData = $cacheFactory('miData'),
      _context = this;

  this._constants = {
    oLookingForOptions: [
        {type: 'Military installation'},
        {type: 'State resources'},
        {type: 'Program or service'}
    ],
    arroFilterByDefault: [
        {type: 'Select Installation or zip code'},
        {type: 'Zip code'},
        {type: 'Installation'}
    ],
    arroFilterByOptions: [
        {type: 'Zip code'},
        {type: 'Installation'}
    ],
    arroMilesOptions: [
        {type: '5 miles'},
        {type: '10 miles'},
        {type: '25 miles'},
        {type: '50 miles'},
        {type: '100 miles'},
        {type: '250 miles'},
        {type: '500 miles'}
    ],
    arroBranches: [
      {
        "sName": "Air Force",
        "bActiveFilter": false
      },
      {
        "sName": "Army",
        "bActiveFilter": false
      },
      {
        "sName": "Navy",
        "bActiveFilter": false
      },
      {
        "sName": "Marine Corps",
        "bActiveFilter": false
      },
      {
        "sName": "Defense Logistics Agency",
        "bActiveFilter": false
      }
    ],
    arroConus: [{
        sName: 'CONUS',
        bActiveFilter: false
    },{
        sName: 'OCONUS',
        bActiveFilter: false
    }],
    arroViewBy: [
      {type: 'Zip Code'},
      {type: 'Installation'}
    ]
  };

  $http.defaults.cache = _oMiData;

  // binds a series of uniquely named constants to a controller's scope
  this.constantify = function(scope, arrsConstants) {
    arrsConstants.forEach(function(sKeyName) {
        if (typeof _context._constants[sKeyName] === 'object') {
            scope[sKeyName] = JSON.parse(JSON.stringify(_context._constants[sKeyName]));
        } else {
            scope[sKeyName] = _context._constants[sKeyName];
        }
    });
  }

  this.get = function(sDataKey) {
    return new Promise(function(resolve, reject){
      $http.get(sDataKey).then(function(response){
          resolve(response.data);
      }, function(reason){
          resolve({
            error: 'An error occurred!'
          });
      })
    });
  }

  // a syntactic sugar for mock data
  this.mock = function(sUriSubstring) {
    return this.get('/data/get-' + sUriSubstring + '.json');
  }

  this.init = function() {
    $http.get('/data/get-installations.json');
    $http.get('/data/get-program-cards.json');
    $http.get('/data/get-programs.json');
    $http.get('/data/states.json');
  }
}])

// ref: https://stackoverflow.com/questions/22408790/angularjs-passing-data-between-pages
// description: this service allows passing data between views
// TODO: maybe all gets should be byval, eg $scope.arroBranches = JSON.parse(JSON.stringify(MI.Data._constants.arroBranches));
.service('MiState', function(){
 var _oState = {};

 function set(data) {
   _oState = data;
 }

 function get() {
  return _oState;
 }

 return {
  set: set,
  get: get
 }
})

// description: creates a base controller
// TODO: a single, generic MI.get() which internally looks at State, Data, $templateCache, $http, then handle error or not found.
// rule of thumb: If three views need it, add it here.
.service('BaseController', ['$location',
                            'cssInjector',
                            'MiData',
                            'MiState',
                            '$templateCache',
                            '$compile',
                            '$timeout',
                            '$window',
                            'Overlay',
                            function($location, cssInjector, MiData, MiState, $templateCache, $compile, $timeout, $window, Overlay) {

    var oContext = this,
        oLazyLoad = {
          miCard: function() {
            myapp._compileProvider.directive('miCard', function() {
              return {
                templateUrl: '/views/miCard/miCard.html'
              }
            })
          }
        };

    function getViewName() {
        var sResolvedViewName = MiData.sResolvedViewName;
        if (sResolvedViewName) {
            MiData.sResolvedViewName = '';
            return sResolvedViewName;
        }

        return $location.$$path.slice(1).split('/')[0] || 'main';
    }

    function getStyle(sViewName) {
        cssInjector.add('/views/' + sViewName + '/' + sViewName + '.css');
    }

    // description: a utility method to quickly get a needed item from a list.
    // finds the first member of arr with a given key-value pair.
    // either returns a desired key's value or else the whole matched object.
    // can support up to 2 levels deep using subkey; objects more complex can't use this approach.
    function getFirstMatch(arr, sKey, sValToMatch, sValToReturn, sSubKey) {
        var arrFiltered = arr.filter(function(el){
          return sSubKey ? el[sKey][sSubKey] === sValToMatch : el[sKey] === sValToMatch;
        }) || '';

        if (arrFiltered && arrFiltered[0]) {
            return sValToReturn ? arrFiltered[0][sValToReturn] : arrFiltered[0];
        }

        return '';
    }

    function init(scope, oOptions) {
      var sViewName = getViewName();

      scope.MI = this;
      MiData.init();

      MiData.get('/views/' + sViewName + '/' + sViewName + '.html').then(function(sHtml) {
        $compile($(sHtml))(scope);              // virtually add dynamic html to controller scope, but do not actually render to browser DOM
        scope.sViewName = sViewName;
        getStyle(sViewName);

        if (oOptions) {
          if (oOptions.constantify) MiData.constantify(scope, oOptions.constantify);
          if (oOptions.lazilyLoad) fLazyLoad(oOptions.lazilyLoad, scope);
          if (oOptions.fCallback) oOptions.fCallback(scope, oOptions);
        }

        scope.$apply();
      });
    }

    // bLazyLoadingDone is needed to trigger $compile because it creates a diff
    // also, make sure your lazily loaded element has some content. Or again, there will be no diff and no render will happen.
    // ref: https://stackoverflow.com/questions/38514918/when-lazy-loading-directive-its-never-run?noredirect=1&lq=1
    function fLazyLoad(arrsfDirectives, scope) {
        arrsfDirectives.forEach(function(sfDirective){
            oLazyLoad[sfDirective]();
        });
        scope.bLazyLoadingDone = true;
    }

    return {
        $location: $location,
        Data: MiData,
        getStyle: getStyle,
        getFirstMatch: getFirstMatch,
        init: init,
        State: MiState,
        $window: $window,
        Overlay: Overlay
    }
}])

// syntactic sugar. Maybe collapse into one service if you want, but this is modular.
.service('MI', ['BaseController', function(BaseController){
  return BaseController;
}])

// don't lazy load these because they're needed on main/initial view
.directive('miSearch', ['MI', function(MI){
  return {
    templateUrl: 'looking-for',
    link: function(scope, element, attrs) {
        var oChangeOptions = scope.$parent.oLookingForSelectionChange;

        if (oChangeOptions) {
            scope.$watch('oLookingForSelection',
                         oChangeOptions.fFunction,
                         oChangeOptions.bDigest);
        }
    }
  }
}])

// TODO: this directive needs it's own scope and data
.directive('miTypeaheadPrograms', function(){
  return {
    templateUrl: 'typeahead-programs'
  }
})
.directive('miTypeaheadInstallations', function(){
  return {
    templateUrl: 'typeahead-installations',
    link: function(scope, element, attrs) {
        // TODO: should MDInstallations be standard under MI.Data?
        // TODO: should we include a reference or element to return on click as a standard here?
        scope.fShowInstallationsOverlay = scope.$parent.fHandleInstallationTextClick || function () {
            scope.arroInstallations = scope.MDInstallations;
            scope.$overlay = scope.MI.Overlay.showByTemplateName(scope, 'installations-overlay');
      }
    }
  }
})
.directive('miRegionAccordions', function(){
  return {
    restrict: 'E',
    templateUrl: 'region-accordions',
    scope: { arrdirectiveregions: '=' },
    link: function(scope, element, attrs) {
        //ref: https://stackoverflow.com/questions/17900201/how-to-access-parent-scope-from-within-a-custom-directive-with-own-scope-in-an
        scope.fHandleInstallationTextClick = scope.$parent.fHandleInstallationTextClick;

        // animated open indicator
        scope.fIndicateOpen = function ($event) {
            var $panelHeading = $($event.currentTarget).find('.panel-heading'),
                $openIndicator = $panelHeading.prev();

            if (!$openIndicator.length) { // create $openIndicator if it's not there
                $openIndicator = $('<div class="open-indicator">');
                $panelHeading.before($openIndicator);
            }

            if ($event.currentTarget.classList.contains('panel-open')) { // ensure indicator is expanded in this case
                $openIndicator.animate({
                    width: 40
                }, 300);
            } else { // ensure indicator is collapsed in this case
                $openIndicator.animate({
                    width: 0
                }, 300);
            }
        }
    }
  }
})

// TODO: delete this block
// define other directives for lazy loading later on
// ref: https://stackoverflow.com/questions/12538665/how-can-directives-be-lazy-loaded-in-angularjs
.config(function ($compileProvider) {
  myapp._compileProvider = $compileProvider;
})

.config(function(cssInjectorProvider){
    cssInjectorProvider.setSinglePageMode(true);
})

// ref: https://stackoverflow.com/questions/20836374/how-to-catch-angular-ng-include-error
// ref: https://stackoverflow.com/questions/19711550/angularjs-how-to-prevent-a-request
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('templateInterceptor');
})

.factory('templateInterceptor', function($q) {
  return {
   'request': function(config) {
       var canceler = $q.defer();
       config.timeout = canceler.promise;

       if (config.url.slice(-1) === '-') {          // this is an ng-include call without valid url. Don't execute call.
         canceler.resolve();
       }

       return config;
    }
  }
})

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main/main.html',
      controller: 'mainController',
      resolve: {
        MDPrograms: function(MI) {
          return MI.Data.mock('programs');
        },
        MDInstallations: function(MI) {
          return MI.Data.mock('installations');
        }
      }
    })
    .when('/milinstall/:sInstallationId', {
      templateUrl: 'views/milinstall/milinstall.html',
      controller: 'miController'
    })
    .when('/milinstall/:sInstallationId/:sCategoryId', {
      templateUrl: 'views/common/common.html',
      controller: 'categoriesController',
      resolve: {
        dependencies: function(MI) {
          MI.Data.sResolvedViewName = 'categories';
          return;
        },
        MDPrograms: function(MI) {
          return MI.Data.mock('programs');
        },
        MDInstallations: function(MI) {
          return MI.Data.mock('installations');
        }
      }
    })

    // yes, use the categoriesController for the topic view
    // if possible, don't even reload the controller on nav from category to topic
    .when('/milinstall/:sInstallationId/:sCategoryId/:sTopicId', {
      templateUrl: 'views/common/common.html',
      controller: 'categoriesController',
      resolve: {
        dependencies: function(MI) {
          MI.Data.sResolvedViewName = 'categories';
          return;
        },
        MDPrograms: function(MI) {
          return MI.Data.mock('programs');
        },
        MDInstallations: function(MI) {
          return MI.Data.mock('installations');
        }
      }
    })
    .when('/programs', {
      templateUrl: 'views/main/program-search.html',
      controller: 'ProgramsController'
    })
    .when('/search', {
      templateUrl: 'views/common/common.html',
      controller: 'searchController',
      resolve: {
        MDPrograms: function(MI) {
          return MI.Data.mock('programs');
        },
        MDInstallations: function(MI) {
          return MI.Data.mock('installations');
        }
      }
    })
    .when('/viewall', {
      templateUrl: 'views/common/common.html',
      controller: 'viewAllController',
      resolve: {
        MDInstallations: function(MI) {
          return MI.Data.mock('installations');
        }
      }
    })
    .when('/planmymove', {
        headerTemplateUrl: 'views/planmymove/planmymove-header.html',
        templateUrl: 'views/planmymove/planmymove.html',
        controller: 'planMyMoveController',
        resolve: {
            MDInstallations: function (MI) {
                return MI.Data.mock('installations');
            }
        }
    })
    .otherwise({
        redirectTo: '/'
    });
});

myapp.factory('prgdata', function () {
    var savedData = {}

    function set(data) {
        savedData = data;
    }

    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }
});

//dynamically sets the header partial for PMM and MI
myapp.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.headerTemplateUrl = current.$$route.headerTemplateUrl || 'views/header/header.html';
    });
}]);

myapp.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

//typeahead filter for first character only
myapp.filter('selectFirstOnlyFilter', function () {
    return function (input, searchString) {
        return input.filter(function (item) {
            if (item.toLowerCase().search(searchString.toLowerCase()) === 0) {
                return true;
            }
            return false;
        })
    }
});

