myapp.controller('planMyMoveController',
    ['$scope',
        'MI',
        'MDInstallations',
        function ($scope, MI, MDInstallations) {

            MI.init($scope, {
                 fCallback: function ($scope, oOptions) {
                     $scope.arroInstallations = MDInstallations;
                     $scope.arroBranches = JSON.parse(JSON.stringify(MI.Data._constants.arroBranches));
                     $scope.arroConus = JSON.parse(JSON.stringify(MI.Data._constants.arroConus));
                     fMapInstallationsToStates();
                 }
            });

            $scope.arrsInstallationNames = MDInstallations.map(function (installation) {
                return installation.name;
            });

            $scope.toggleCurrentStationSelected = function ($model) {
                $scope.isCurrentStationSelected = ($model) ? true : false;
            }

            $scope.toggleNewStationSelected = function ($model) {
                $scope.isNewStationSelected = ($model) ? true : false;
            }

            $scope.getActiveCheckListStyle = function () {
                if (MI.State.sPmmCurrentInstallation && MI.State.sPmmNewInstallation && $scope.memberType) {
                    return 'active';
                }
            }

            // TODO: Move to the miTypeaheadInstallations directive
            $scope.fShowInstallationsOverlay = function (bNewInstallation) {
                $scope.$overlay = MI.Overlay.showByTemplateName($scope, 'installations-overlay');
                MI.State.sInstallationBeingSelected = bNewInstallation ? 'sPmmNewInstallation' : 'sPmmCurrentInstallation';
            }

            $scope.fHandleInstallationTextClick = function(oInstallation) {
                MI.State[MI.State.sInstallationBeingSelected] = oInstallation.name;
                fOverlayClose();
            }

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
            }

            $scope.$watch('arroBranches', function (newValue, oldValue, _scope) {
                fMapInstallationsToStates();
            }, true);
}]);
