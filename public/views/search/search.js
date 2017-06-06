myapp.controller('searchController', ['$scope',
                                      'MI',
                                      'MDPrograms',
                                      'MDInstallations',
                                      '$templateCache',
                                      '$compile',
function ($scope, MI, MDPrograms, MDInstallations, Overlay, $templateCache, $compile) {

        MI.init($scope, {
            constantify: ['arroViewBy', 'arroFilterBy', 'arroMilesOptions', 'oLookingForOptions'],
            lazilyLoad: ['miCard'],
            fCallback: function ($scope, oOptions) {
                $scope.oLookingForSelection = $scope.oLookingForOptions[2];
                $scope.oViewBy = MI.State.sZipCodeText ? $scope.arroViewBy[0] : $scope.arroViewBy[1];

                $scope.arrsProgramNames = MDPrograms.map(function (oProgram) {
                    return oProgram.name;
                });

                $scope.arrsInstallationNames = MDInstallations.map(function (oInstallation) {
                    return oInstallation.name;
                });

                MI.Data.get('/data/get-program-cards.json').then(function (arroCards) {
                    $scope.arroCards = arroCards;
                    fGetMassagedProgramCards();
                    fGetFilteredProgramCards();
                    $scope.$apply();
                });

                fUpdateTags();
            }
        });

        $scope.oLookingForSelectionChange = {
            fFunction: function(newValue, oldValue, _scope) {
                if (newValue && newValue.type !== 'Program or service') {
                    MI.State.oLookingForOptions = newValue;
                    MI.$location.path('');
                }
            },
            bDigest: true
        };

        $scope.$watch('arroFilters', function(newValue, oldValue, _scope) {
            fGetFilteredProgramCards();
        }, true);

        //TODO: move this logic into the mi-typeahead-installations directive
        $scope.$watchGroup(['MI.State.sInstallationSelected',
                            'MI.State.sZipCodeText',
                            'MI.State.sProgramSelected',
                            'MI.State.oMilesbySelected'], function (newValue, oldValue, _scope) {
            var oNewInstallation = MDInstallations.filter(function (oInstallation) {
                return oInstallation.name === MI.State.sInstallationSelected;
            })[0];

            MI.State.oInstallation = oNewInstallation || MI.State.oInstallation;
            fUpdateTags();
        }, true);

        function fGetMassagedProgramCards() {
            $scope.arroMassagedProgramCards = [];
            $scope.arroCards.forEach(function (oCard) {
                var oMassagedCard = {
                    arroCardItems: [],
                    addressline1: oCard.address1,
                    addressline2: oCard.address2,
                    category: oCard.category,
                    email: MI.getFirstMatch(oCard.links, 'type', 'email', 'link'),
                    installationName: oCard.installationName,
                    majorBranch: oCard.majorBranch,
                    map: MI.getFirstMatch(oCard.links, 'type', 'map', 'link'),
                    name: oCard.name,
                    phoneOffice: MI.getFirstMatch(oCard.phone, 'type', 'office', 'number'),
                    phoneOfficeDsn: MI.getFirstMatch(oCard.phone, 'type', 'officedsn', 'number'),
                    phoneFax: MI.getFirstMatch(oCard.phone, 'type', 'fax', 'number'),
                    phoneFaxDsn: MI.getFirstMatch(oCard.phone, 'type', 'faxdsn', 'number'),
                    scheduleWeekdays: MI.getFirstMatch(oCard.schedule, 'name', 'weekdays', 'time'),
                    scheduleWeekends: MI.getFirstMatch(oCard.schedule, 'name', 'weekends', 'time'),
                    scheduleHolidays: MI.getFirstMatch(oCard.schedule, 'name', 'holidays', 'time'),
                    website: MI.getFirstMatch(oCard.links, 'type', 'website', 'link'),
                    sZip: oCard.address2.slice(-5)
                }

                $scope.arroMassagedProgramCards.push(oMassagedCard);
            });
        }

        function fGetFilteredProgramCards() {
            if (!$scope.arroMassagedProgramCards) $scope.arroMassagedProgramCards = [];
            $scope.arroFilteredProgramCards = $scope.arroMassagedProgramCards
                .filter(function (oCard) {
                    var bAllowed = true;

                    if (MI.State.sInstallationSelected && MI.State.sInstallationSelected !== oCard.installationName) bAllowed = false;
                    if (MI.State.sZipCodeText && MI.State.sZipCodeText !== oCard.sZip) bAllowed = false;

                    return bAllowed;
                });
        }

        function fUpdateTags() {
            $scope.arroFilters = [];

            MI.State.oMilesbySelected = MI.State.oMilesbySelected || '5';
            $scope.arroFilters.push({
                type: 'miles',
                miles: MI.State.oMilesbySelected
            });

            MI.State.sZipCodeText && $scope.arroFilters.push({
                type: 'zip',
                zip: MI.State.sZipCodeText,
                sDisplayText: 'within ' + MI.State.oMilesbySelected + ' miles of ' + MI.State.sZipCodeText
            });

            MI.State.sProgramSelected && $scope.arroFilters.push({
                type: 'category',
                category: MI.State.sProgramSelected,
                sDisplayText: MI.State.sProgramSelected
            });

            MI.State.oInstallation && $scope.arroFilters.push({
                type: 'installationName',
                installationName: MI.State.oInstallation.name,
                installation: MI.State.oInstallation,
                sDisplayText: MI.State.oInstallation.name + ' - ' + MI.State.oInstallation.branch
            });

            $scope.iDisplayedFilterCount = $scope.arroFilters.filter(function(oFilter){
                return oFilter.sDisplayText;
            }).length;
        }
}]);