/* This is a temporary modal functionality until a common one is finalized */
/* this file will be deleted so cleanup not required */
// TODO: why are we mixing controllers on main.html? remove this controller. The scope is wrong on those drop downs anyway
myapp.controller('programModalCtrl', function ($scope, $uibModal, $log, $document, cssInjector, Overlay, $templateCache, $compile) {
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.


myapp.controller('ProgramsController', ['$scope',
                                    '$location',
                                    '$timeout',
                                    '$window',
                                    'cssInjector',
                                    'Overlay',
                                    '$templateCache',
                                    '$compile',
                                    'prgdata',
function ($scope, $location, $timeout, $window,  cssInjector, Overlay, $templateCache, $compile,prgdata) {

cssInjector.add('/views/main/program-search.css');

 $scope.fNavToHome = function() {
        $location.path('');
      }


$scope.programs = ["ALL Location", "Adult Education Centers", "Automotive Services",
            "Barracks/Single Service Member Housing", "Beauty/Barber Shops", "Beneficiary Counseling Assistance Coordinators",
            "Chapels", "Child and Youth Registration and Referral", "Child Development Centers",
            "Citizenship and Immigration Services", "Civilian ersonnel Office", "Commissary/Shoppette",
            "Dental Clinics", "Deployment/Mobilization", "DoD Schools",
            "EFMP - Enrollment", "EFMP - Family Support", "Education and Development Intervention Services (EDIS)",
            "Emergency Relief Services", "Exchange(s)", "Family Advocacy Program", "Family Center",
            "Family Child Care/Child Development Homes", "Finance Office", "Financial Institutions",
            "Golf Courses", "Gymnasiums/Fitness Centers", "Hospitals/Medical Treatment Facility(s)",
            "Household Goods/Transportation Office (inbound)", "Household Goods/Transportation Office (outbound)",
            "Housing Office/Government Housing", "Housing Referral Office/Housing Privatization", "ID/CAC Card Processing",
            "Information and Referral Services", "Legal Services/JAG", "Library", "Loan Closet", "MWR (Morale Welfare and ecreation)",
            "Military Clothing Sales", "New Parent Support Program", "Non-appropriated Funds (NAF) Human esources",
            "Personal Financial Management Services", "Personnel Support Office", "Relocation Assistance Program",
            "Restaurants/Fast Food", "Retirement Services", "School Age Care", "School Liaison Office/Community chools",
            "Spouse Education, Training and Careers", "Temporary Lodging/Billeting", "Transition Assistance Program",
            "Travel Office", "VA Facilities", "Veterinary Services", "Victim Advocate Services", "Welcome / Visitor Center",
            "Women, Infants and Children(WIC & WIC - O)", "Youth Programs / Centers"
        ];

  $scope.rowsCount = [];

  $scope.createRows = function() {
    for (var i = 0; i < ($scope.programs.length / 3); i++) {
      $scope.rowsCount.push(i);
    }
  };
  $scope.createRows();

  $scope.programslen = $scope.programs.length

  $scope.trackclick = function(passval){
    $scope.q = passval;
  }

  $scope.clickme = function (q) {
     
      prgdata.set (q)
      $location.path('');
  }

  

}])

myapp.controller('ModalInstanceCtrl', function ($uibModalInstance, items, $scope, $location) {
    
    cssInjector.add('/views/main/program-search.css');

    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };
        
    

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.checkclick = function (inputval) {
         // body..
         return $scope.selectedItem = inputval;
        
     }

    $scope.programs = ["Location", "Adult Education Centers", "Automotive Services",
            "Barracks/Single Service Member Housing", "Beauty/Barber Shops", "Beneficiary Counseling Assistance Coordinators",
            "Chapels", "Child and Youth Registration and Referral", "Child Development Centers",
            "Citizenship and Immigration Services", "Civilian ersonnel Office", "Commissary/Shoppette",
            "Dental Clinics", "Deployment/Mobilization", "DoD Schools",
            "EFMP - Enrollment", "EFMP - Family Support", "Education and Development Intervention Services (EDIS)",
            "Emergency Relief Services", "Exchange(s)", "Family Advocacy Program", "Family Center",
            "Family Child Care/Child Development Homes", "Finance Office", "Financial Institutions",
            "Golf Courses", "Gymnasiums/Fitness Centers", "Hospitals/Medical Treatment Facility(s)",
            "Household Goods/Transportation Office (inbound)", "Household Goods/Transportation Office (outbound)",
            "Housing Office/Government Housing", "Housing Referral Office/Housing Privatization", "ID/CAC Card Processing",
            "Information and Referral Services", "Legal Services/JAG", "Library", "Loan Closet", "MWR (Morale Welfare and ecreation)",
            "Military Clothing Sales", "New Parent Support Program", "Non-appropriated Funds (NAF) Human esources",
            "Personal Financial Management Services", "Personnel Support Office", "Relocation Assistance Program",
            "Restaurants/Fast Food", "Retirement Services", "School Age Care", "School Liaison Office/Community chools",
            "Spouse Education, Training and Careers", "Temporary Lodging/Billeting", "Transition Assistance Program",
            "Travel Office", "VA Facilities", "Veterinary Services", "Victim Advocate Services", "Welcome / Visitor Center",
            "Women, Infants and Children(WIC & WIC - O)", "Youth Programs / Centers"
        ];




});

// Please note that the close and dismiss bindings are from $uibModalInstance.

myapp.component('modalComponent', {
    templateUrl: 'myModalContent.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function () {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = {
                item: $ctrl.items[0]
            };
        };

        $ctrl.ok = function () {
            $ctrl.close({$value: $ctrl.selected.item});
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
});