myapp.controller('miController', ['$scope',
                                  'MI',
                                  '$routeParams',
function ($scope, MI, $routeParams) {

      MI.init($scope, {
        fCallback: function($scope, oOptions) {
            $scope.bShowBackLink = true;

            MI.Data.get('/data/get-installation/' + $routeParams.sInstallationId + '.json')
              .then(function(data){
                  $scope.installData = data;
                  $scope.$apply();
              });

            //weather for Quantico - coordinates hardcoded currently
            MI.Data.get('https://api.weather.gov/points/38.52,-77.29/forecast')
              .then(function success(data) {
                  $scope.temperature = data.error || data.properties.periods[0].temperature;
                  $scope.$apply();
              });
        }
      });

}]);
