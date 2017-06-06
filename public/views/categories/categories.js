myapp.controller('categoriesController', ['$scope',
                                  'MI',
                                  '$routeParams',
function ($scope, MI, $routeParams) {

      MI.init($scope, {
        lazilyLoad: ['miCard'],
        fCallback: function($scope, oOptions) {

            if (MI.State.oCategory) {                                           // no need to make service call
              _fContinueInit();
            } else {
                MI.Data.get('/data/get-installation/' + $routeParams.sInstallationId + '.json')
                .then(function(_oInstallation) {
                    MI.State.oInstallation = _oInstallation;
                    MI.State.oCategory = MI.getFirstMatch(_oInstallation.categories, 'link', $routeParams.sCategoryId, '', 'nav');

                    if ($routeParams.sTopicId) {
                        MI.State.oTopic = MI.getFirstMatch(MI.State.oCategory.topics, 'id', $routeParams.sTopicId);
                        MI.State.oPageData = MI.State.oTopic;
                    } else {
                        MI.State.oPageData = MI.State.oCategory;
                    }

                    _fContinueInit();
                    $scope.$apply();
                });
            }

            function _fContinueInit() {
                fInstallationToCard();
                $scope.bShowBackLink = true;
                $scope.sViewSuperTitle = MI.State.oInstallation.name;  // it should at least have oCard.name = Quantico
                $scope.sViewTitle = MI.State.oPageData.pageTitle;
            }

            function fInstallationToCard(oInstallation) {
                var oCard = JSON.parse(JSON.stringify(MI.State.oInstallation));

                MI.State.oMassagedInstallation = {
                    addressline1: oCard.primaryContact.address.addressline1,
                    addressline2: oCard.primaryContact.address.addressline2,
                    category: oCard.category,
                    email: oCard.primaryContact.email,
                    installationName: oCard.name,
                    majorBranch: oCard.majorBranch,
                    map: MI.getFirstMatch(oCard.primaryContact.links, 'type', 'map', 'link'),
                    name: oCard.name,
                    phoneOffice: MI.getFirstMatch(oCard.primaryContact.phone, 'type', 'primary', 'phoneNum'),
                    phoneFax: MI.getFirstMatch(oCard.primaryContact.phone, 'type', 'fax', 'phoneNum'),
                    website: MI.getFirstMatch(oCard.primaryContact.links, 'type', 'website', 'link'),
                    sZip: oCard.primaryContact.address.zip5
                }

                $.extend(MI.State.oMassagedInstallation, oCard, MI.State.oMassagedInstallation);        // keep anything on oCard that wasn't massaged into another key
            }
        }
      });

    $scope.fNavigateToTopic = function(sStringToAppend) {
        var sCategorySlug = MI.State.oCategory.link.nav,
            sCategoryPath = MI.$location.path().split(sCategorySlug)[0] + sCategorySlug;

        sStringToAppend = sStringToAppend || '';
        MI.$location.path(sCategoryPath + sStringToAppend);
    }

    $scope.fHandleAssociatedLinkClick = function(sLink) {
        window.location.href = sLink;
    }
}]);
