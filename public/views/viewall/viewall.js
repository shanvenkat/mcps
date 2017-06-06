myapp.controller('viewAllController', ['$scope',
                                       'MI',
                                       'MDInstallations',
function ($scope, MI, MDInstallations) {

      MI.init($scope, {
        constantify: ['oLookingForOptions'],
        fCallback: function($scope, oOptions) {
          $scope.sViewTitle = 'View all installations';

          $scope.arrsConusToggleOptions = ['CONUS / United States', 'OCONUS / Overseas'];
          $scope.iSelectedIndexConus = 0;
          $scope.arroBranches = JSON.parse(JSON.stringify(MI.Data._constants.arroBranches));

          $scope.arroInstallations = MDInstallations;
          fMapInstallationsToStates();
        }
      });

      $scope.fConusToggleClicked = function($index) {
        $scope.iSelectedIndexConus = $index;
        fGetConusGroup();
      }

      $scope.fNavToMainView = function() {
        MI.$location.path('');
      }

      // if bGetStates is false then it will get by country (OCONUS)
      // "filtered by" means allowed per business rule
      function fFilterInstallations(sRegion, bGetStates) {
        var sKeyProperty = bGetStates ? 'state' : 'country',
            arrsActiveBranches = [];

        arrsActiveBranches = $scope.arroBranches.filter(function(oBranch){
          return oBranch.bActiveFilter;
        })
        .map(function(oBranch){
          return oBranch.sName;
        });

        if (arrsActiveBranches.length === 0) {                                      // business rule: if nothing is checked, show all.
            arrsActiveBranches = MI.Data._constants.arroBranches
                .map(function(oBranch){
                  return oBranch.sName;
                });
        }

        return $scope.arroInstallations.filter(function(oInstallation) {
            return (arrsActiveBranches.indexOf(oInstallation.branch) > -1) && oInstallation[sKeyProperty] === sRegion;
        });
      }

      function fGetConusGroup() {
        var arroFilteredData = $scope.iSelectedIndexConus ? $scope.arroCountries : $scope.arroStates;
        $scope.arroRegions = arroFilteredData;
      }

      function fMapInstallationsToStates() {
        var oStates = {},
            oCountries = {};

        $scope.arroStates = [];                 // reset to empty
        $scope.arroCountries = [];
        if (!$scope.arroInstallations) return;  // eg on view change data hasn't loaded yet

        $scope.arroInstallations.forEach(function(element, index, array) {
          if (element.state) {
            oStates[element.state] = 1;
          } else {
            oCountries[element.country] = 1;
          }
        });

        Object.keys(oStates).forEach(function(element, index, array) {
          var oStateWithInstallations = {
            sName: element,
            oInstallations: fFilterInstallations(element, true)
          };

          $scope.arroStates = ($scope.arroStates || []).concat(oStateWithInstallations).filter(function(oRegion){
            return oRegion.oInstallations.length > 0;
          });
        });

        Object.keys(oCountries).forEach(function(element, index, array) {
          var oCountriesWithInstallations = {
            sName: element,
            oInstallations: fFilterInstallations(element, false)
          };

          $scope.arroCountries = ($scope.arroCountries || []).concat(oCountriesWithInstallations).filter(function(oRegion){
            return oRegion.oInstallations.length > 0;
          });
        });

        fGetConusGroup();
      }

      $scope.fShowBranchFilterOverlay = function() {
        $scope.$overlay = MI.Overlay.show($scope, 'branch-filter-overlay-body', _fBeforeShow);

        function _fBeforeShow($overlay) {
          $overlay.find('.icon-button.top-right p').text('CLOSE');
          $overlay.addClass('fullscreen branch-filter-overlay');
          $overlay.find('.popup-window, .red-button-container').addClass('fullscreen');
          $overlay.find('.popup-heading').remove();

          var $clearAll = $('<button class="filled-button blue-pill-large clear-all"><div class="text">Clear All</div></button>');
          $clearAll.click(function(){
            $scope.arroBranches.forEach(function(oBranch){
              return oBranch.bActiveFilter = false;
            });
            $scope.$apply();
          });

          $overlay.find('.filled-button')
            .text('APPLY')
            .removeClass('red red-button')
            .addClass('blue-pill-large')
            .click(function(){
            $overlay.hide(350, function(){
              $overlay.remove();
            });
          })
          .after($clearAll);
        }
      }

      $scope.fAnyBranchFiltered = function() {
        return $scope.arroBranches.filter(function(oBranch){
          return oBranch.bActiveFilter;
        }).length > 0;
      }

      $scope.fHandleInstallationTextClick = function(_oInstallation) {
        MI.State.oInstallation = _oInstallation;

        // TODO: remove the below filter call which forces selection of MFB Quantico for mock purposes
        MI.State.oInstallation = $scope.arroInstallations.filter(function(oInstallation) {
            return oInstallation.name === 'Marine Corps Base Quantico';
        })[0];

        MI.$location.path('milinstall/' + MI.State.oInstallation.installationId);
      }

      $scope.$watch('arroBranches', function(newValue, oldValue, _scope) {
        fMapInstallationsToStates();
      }, true);
}]);
