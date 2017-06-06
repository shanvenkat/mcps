/**
 * 
 * MD* is a convention meaning "MI Data."
 * This is a data object which was resolved in app.js using $routeProvider before the controller loaded.
 * Only preload data needed during initialization.
 * Other data should be obtained after initialization by calling MI.Data.get() or .mock();
 * All constants and service data can be captured there.
 * 
 **/

// TODO: arrsProgramNames and perhaps additional logic should be contained within mi-typeahead-programs directive
myapp.controller('mainController', ['$scope',
    'MI',
    'MDPrograms',
    'MDInstallations',
    'Overlay',
    '$templateCache',
    '$compile',
    'prgdata',
    '$location',
    function ($scope, MI, MDPrograms, MDInstallations, Overlay, $templateCache, $compile, prgdata, $location) {
      
      MI.init($scope, {
        constantify: ['oLookingForOptions', 'arroFilterByDefault', 'arroFilterByOptions', 'arroMilesOptions', 'arroBranches', 'arroConus'],
        // TODO: requestData: [{name: name, source: source}]
        fCallback: function($scope, oOptions) {
          $scope.arrsProgramNames = MDPrograms.map(function(oProgram){
            return oProgram.name;
          });

          $scope.arrsInstallationNames = MDInstallations.map(function(oInstallation){
            return oInstallation.name;
          });

          $scope.sPlaceholderDesc = 'Type your search here';
          $scope.selected = undefined;
          $scope.isOptionListOpen = undefined;                                  // it could refer to any option list in the main view
          $scope.oMilesbySelected = $scope.arroMilesOptions[1];
          $scope.oLookingForSelection = MI.State.oLookingForOptions || $scope.oLookingForOptions[0];
          $scope.oFilterBySelected = $scope.arroFilterByDefault[0];
        }
      });

      $scope.fRemoveFilterDefault = function() {
          $scope.arroFilterByDefault = $scope.arroFilterByOptions;
      };

      $scope.fNavToMiInstallLanding = function () {
          MI.$location.path('milinstall/1234'); //TODO - need to get installation id based on user input and then route
      };

      $scope.fNavToPrgrams = function () {
          $location.path('programs');
      }

      $scope.fNavToSearchResults = function() {
          MI.State.sZipCodeText = $scope.sZipCodeText;
          MI.State.oMilesbySelected = $scope.oMilesbySelected;

          if (MI.State.sInstallationSelected) {
            MI.State.oInstallation = MDInstallations.filter(function(oInstallation){
                return oInstallation.name === MI.State.sInstallationSelected;
            })[0];
          }

          MI.$location.path('search');
      }

      // TODO: Move to the miTypeaheadInstallations directive
      $scope.fShowInstallationsOverlay = function () {
          $scope.arroInstallations = MDInstallations;
          $scope.$overlay = MI.Overlay.showByTemplateName($scope, 'installations-overlay');
      }

      $scope.fSelectInstallation = function(oInstallation) {
          MI.State.sInstallationSelected = oInstallation.name;
          fOverlayClose();
      }

      $scope.fShowSearchButton = function() {
        var bAllowed = false,
            sLookingForSelection = $scope.oLookingForSelection && $scope.oLookingForSelection.type;
            sSelectedFilter = $scope.oFilterBySelected && $scope.oFilterBySelected.type;

        if ($scope.fShowMainRow('Installation')) bAllowed = true;
        if ($scope.fShowMainRow('Zip code')) bAllowed = true;

        return bAllowed;
      }

      $scope.fShowIdLikeToFilterByRow = function(sval) {
        return $scope.oLookingForSelection
                && $scope.oLookingForSelection.type === 'Program or service'
                && $scope.arrsProgramNames.indexOf(MI.State.sProgramSelected) > -1;
      }

      $scope.fShowMainRow = function(sFilter) {
        return $scope.fShowIdLikeToFilterByRow()
               && $scope.oLookingForSelection.type === 'Program or service'
               && $scope.oFilterBySelected.type === sFilter;
      }

      $scope.openOverlay = function() {
        $scope.$overlay = Overlay.show($scope, 'branch-filter-overlay-body', _fBeforeShow);            // $template may not be needed

        function _fBeforeShow($overlay) {
          $overlay.find('.icon-button.top-right p').text('CLOSE');
          var $title = $('<div class="programs-overlay-title">PROGRAMS & SERVICES</div>');
          var $searchBar = $('<div class="programs-overlay-searchbar"></div>');
          var $searchIcon = $('<i class="ion-android-search" title="Search"></i>');
          $searchBar.html($searchIcon);
          $overlay.find('.popup-heading').html($title).append($searchBar);

          $overlay.find('.popup-text').html();                       // TODO: add three guttered columns
          $overlay.find('.subheader').remove();
          $overlay.find('.red-button-container').remove();

          $overlay.addClass('fullscreen branch-filter-overlay');
          $overlay.find('.popup-window').addClass('fullscreen');
        }
      }

      // kind of but not really a check to make sure all fields are filled
      // includes validation rules to activate the search button
      $scope.fMainFieldsFilled = function() {
        var bAllFieldsFilled = true;

        if ($scope.oFilterBySelected && $scope.oFilterBySelected.type === 'Installation') {
          return MI.State.sInstallationSelected
                  && $scope.arrsInstallationNames.indexOf(MI.State.sInstallationSelected) > -1;
        } else {
          return $scope.sZipCodeText
                  && $scope.sZipCodeText.length === 5
                  && angular.isNumber(+$scope.sZipCodeText);       // + operator tries to coerce to integer
        }
      }

      $scope.$watch('oLookingForSelection', function(newValue, oldValue, _scope) {
          var _sOldDesc = $scope.sPlaceholderDesc;

          if (MI.State.sInstallationName) {
              $scope.oLookingForSelection = $scope.oLookingForOptions[2];
              $scope.oFilterBySelected = $scope.arroFilterByDefault[2];
          } else if(newValue) {
              $scope.sPlaceholderDesc = (newValue.type === 'State resources') ? 'Type your state here' : 'Type your search here';
              MI.State.sInstallationSelected = '';
              MI.State.sInstallationName = '';                                   // use then discard but don't reapply
              MI.State.sProgramSelected = '';
          }

          var prgoval = prgdata.get();
          if (typeof prgoval === 'string' || prgoval instanceof String ) {
            $scope.oLookingForSelection = $scope.oLookingForOptions[2];
            $scope.sProgramSelected = prgoval;
            $scope.fShowIdLikeToFilterByRow();
          }

      }, true);

        $scope.fUibItemClick = function (obj) {
            $scope.oMilesbySelected = obj; // more generically, MI.State[oUibSelector] = obj;
        }

        $scope.$watch('MI.State.sProgramSelected', function (newValue, oldValue, _scope) {
            $scope.fShowIdLikeToFilterByRow();
        }, true);

        $scope.$watch('bUibDropdownOpen', function (bNewValue) {
            $('.dropdown-menu[uib-dropdown-menu]').css('width', function () {
                return $('.uib-dropdown-group').outerWidth() - 83 + 'px';
            });
        });
}])
