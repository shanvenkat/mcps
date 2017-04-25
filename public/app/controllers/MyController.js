/* Controller Registered under Module named myapp, Here controller calls to scope, Services Javascript object 
to further process and return data stored in scope, Scope is inturn glued to the view*/

// Controller # 1
myapp.controller('MyController', function ($scope, $routeParams, MyService, $filter, $location) {
    // Initialize to load default data to populate the page    

    init();
    function init() {
        $scope.persons = MyService.getpersons();
        $scope.personscount = MyService.getpersons().length;
    }

    $scope.addperson = function () {
        var firstName = $scope.newperson.FirstName;
        var lastName = $scope.newperson.LastName;
        var age = $scope.newperson.Age;
       
        MyService.insertperson(firstName, lastName, age);
        $location.path('/allperson');
   };

   
     $scope.deleteemployee = function (id) {
        MyService.deleteperson(id);
    };

    // Customer Filter in Controller as Javascript function
    $scope.$watch("filterValue", function (filterInput) {
        if (filterInput == undefined) {
            $scope.filteredPersons = MyService.getpersons();
        }
        else {
            var persons = MyService.getpersons();
            $scope.filteredPersons = $filter("PersonFilter")(persons, filterInput);                       
        }
    });

});

 
// Contgroller # 2
myapp.controller('PersonDetailsController', function ($scope, $routeParams, MyService, $location) {
     $scope.getperson = {};   
    init();
    function init() {        
       // get Employeeid from RouteParams and parse to make sure it is Integer.   
        var id = ($routeParams.id) ? parseInt($routeParams.id) : 0;
        if (id > 0) {
            $scope.getperson = MyService.getperson(id);
        }
    }

    
     $scope.deleteemployee = function (id) {
        MyService.deleteperson(id);
        $location.path('/allperson');
    };


});

// Controller 3 for Navigation stuff
myapp.controller('navCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';
        return page === currentRoute ? 'active' : '';
    };
} ]);


// Controller 3 for Navigation stuff
myapp.controller('typeController',  ['$scope', '$location', '$window',  'BasesModel', 'StateModel', 
    'ProgramsModel', 'CardDataModel', '$resource',  
    function ($scope, $location, $window ,BasesModel, StateModel, ProgramsModel, CardDataModel, $resource) {
    
    $scope.init = function () {
    // check if there is query in url
    // and fire search in case its value is not empty
    //alert ($scope.ins.selected);
     //$scope.displaynow =  $scope.ins.selected;
    };

    //http://www.militaryinstallations.dod.mil/MOS/f?p=132:CONTENT:::NO::P4_INST_ID,P4_CONTENT_DIRECTORY,P4_ZIP,P4_DST,P4_TAB:' + getIDfromInstype(selIns, BasesModel) + "," + getIDfromPrograms(selPrg, ProgramsModel) +',,10,IC'

    $scope.example9model = []; 
    //$scope.ins.selected = []; 
    
    $scope.instypeModel = [];
    $scope.stringData = [ 
    "ALL", "Auto", "Dental"
    ]; 

    $scope.instypeData = [ 
    "Fort Belvoir", "Fort Bragg", "Fort Campbell"
    ]; 

    //{ template: '{{option}}', smartButtonTextConverter(skip, option) { return option; }, }

    $scope.example9settings = {template: '{{option}}' , scrollableHeight: '300px', scrollable: true, checkBoxes: true, enableSearch: true};
    $scope.instypeSettings = {template: '{{option}}' , scrollableHeight: '300px', scrollable: true, checkBoxes: true, enableSearch: true};

   $scope.miles = [
   
    {id : "25", values : "25 miles"},
    {id : "50", values : "50 miles"},
    {id : "100", values : "100 miles"},
    {id : "250", values : "250 miles"},
    {id : "500", values : "500 miles"}
];


    $scope.hasChanged = function(){
        if ($scope.data.singleSelect == 'A Military Installation'){
             $scope.mibases = getArrayCol (BasesModel)
        }  
         else if ($scope.data.singleSelect == 'State resources') {
              $scope.states = getStatesID (StateModel)
        }
         else if ($scope.data.singleSelect == 'Program or service') {
                  $scope.prgmibases = getArrayCol (BasesModel)  
                  $scope.selectMiles = $scope.miles[0].values;
         }      
    }
   

    /*var resource = $resource("http://mos4-dev.militaryonesource.mil:8080/api/jsonws/installations-service-plugin-portlet.installation/get-installations",
        {
           callback: "JSON_CALLBACK",
           headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Content-Type-Options':'nosniff'
            }

        },
        {
            getInstal: { method: "GET" }
        }
    );

    resource.getInstal().$promise.then(
                            function (resultset) {
                                $scope.getall = "hello world";
                            },
                            function (error) {
                                console.log("Error");
                            }
                        ); */
  
       
    function getIDfromInstype (slct, availableOptions){
            for (item in availableOptions){
               if (availableOptions[item].name == slct){
                    retvalname = (availableOptions[item].id);
               }    
        }
            return retvalname;
       }  

    function getIDfromStateVal (slct, availableOptions){
            for (item in availableOptions){
               if (availableOptions[item].state == slct){
                    retvalname = (availableOptions[item].id);
               }    
        }
            return retvalname;
       }  

    function getIDfromPrograms (slct, availableOptions){
            for (item in availableOptions){
               if (availableOptions[item].programs == slct){
                    retvalname = (availableOptions[item].id);
               }    
        }
            return retvalname;
       }  

    function getIDfromMiles (slct, availableOptions){
            for (item in availableOptions){
               if (availableOptions[item].values == slct){
                    retvalname = (availableOptions[item].id);
               }    
        }
            return retvalname;
       }  

    function getArrayCol (BasesModel){
            var arrmibases = [];
            for (item in BasesModel){
            arrmibases.push(BasesModel[item].name);
        }
        return arrmibases;       
    }  

   function getStatesID (StateModel){
            var arrstatesval = [];
            for (item in StateModel){
            arrstatesval.push(StateModel[item].state);
        }
        return arrstatesval;       
    }  
  
    function getProgramsID (ProgramsModel){
            var arrprgsval = [];
            for (item in ProgramsModel){
            arrprgsval.push(ProgramsModel[item].programs);
        }
        return arrprgsval;       
    } 



    $scope.misubmission = function(slctkey){
        $window.open('http://www.militaryinstallations.dod.mil/MOS/f?p=132:CONTENT:::NO::P4_INST_ID,P4_INST_TYPE:' + getIDfromInstype(slctkey, BasesModel))
        $scope.base.selected=null;
    }

    $scope.statesubmission = function(slctkey){
        $window.open('http://www.militaryinstallations.dod.mil/MOS/f?p=132:CONTENT:::NO::P4_INST_ID,P4_INST_TYPE:' + getIDfromStateVal(slctkey, StateModel))
         $scope.state.selected=null;
    }
       
    $scope.zipsubmission = function(selZip, selMiles, selPrg){
        

        arrcollectZipSelect = [];
             
        
        if (selPrg == 'ALL'){
            if (((selZip =='undefined')) || (typeof(selZip) == 'undefined')){
                arrcollectZipSelect = ['Belvoir Auto', 'Bragg Dental', 'Campbell Auto', 'Campbell Dental']; 
            }
            else if ((typeof(selZip) === 'string') && (selZip == '')){
                arrcollectZipSelect = ['Belvoir Auto', 'Bragg Dental', 'Campbell Auto', 'Campbell Dental']; 
            }
        }
        if (selPrg == 'Auto'){
                    
            if (selZip == '42223' && selMiles == '500 miles'){
                    arrcollectZipSelect = ['Belvoir Auto',  'Campbell Auto'];   
            }
            else if (selZip =='42223' && selMiles != '500 miles'){
                arrcollectZipSelect = ['Campbell Auto'];
            }
            else if (selZip == '22060'){
                arrcollectZipSelect = ['Belvoir Auto'];
            }

            else if ((selZip =='undefined') || (typeof(selZip) == 'undefined')){
                arrcollectZipSelect = ['Belvoir Auto',  'Campbell Auto']; 
            }
            else if ((typeof(selZip) === 'string') && (selZip == '')){
                arrcollectZipSelect = ['Belvoir Auto',  'Campbell Auto']; 
            }
           
        }


        if (selPrg == 'Dental'){
            
            if (selZip == '28307'){
                arrcollectZipSelect = ['Bragg Dental'];
            }
            else if ((selZip =='undefined') || (typeof(selZip) === 'undefined')){
              
                arrcollectZipSelect = ['Bragg Dental',  'Campbell Dental'];
            }
            else if ((typeof(selZip =='string')) && (selZip == '')){

                arrcollectZipSelect = ['Bragg Dental',  'Campbell Dental'];
            }
            else if ((selZip == '42223') && (selMiles == '500 miles')){
                 
                arrcollectZipSelect = [ 'Bragg Dental', 'Campbell Dental'];
            }
            else if (selZip == '42223' && (selMiles != '500 miles'))
            {

                arrcollectZipSelect = ['Campbell Dental'];
            }
        }

        $scope.setContacts = arrcollectZipSelect;
        }
   


    $scope.prgInsSubmission = function (prgdata, insdata){
        //var baseurl = 'http://www.militaryinstallations.dod.mil/MOS/f?p=132:CONTENT:::NO::P4_INST_ID,P4_CONTENT_DIRECTORY,P4_ZIP,P4_DST,P4_TAB:' 
        //resturl = 'getIDfromInstype(selIns, BasesModel)' + "," + 'getIDfromPrograms(selPrg, ProgramsModel)' 
        //var tinyurl = ',,10,IC'

        //var arrurlsval = [];
        //alert ('hello')
            
            /*for (prgitem in prgdata){
                for (insitem in insdata){
                    insid = getIDfromInstype(insdata[insitem], BasesModel); 
                    prgid = getIDfromPrograms(prgdata[prgitem], ProgramsModel);
                    arrurlsval.push(baseurl + insid + ',' + prgid + tinyurl);
                    $scope.setUrls = arrurlsval;
                }
            }*/
        
        
        
        
        //alert (arrurlsval);
        //return arrurlsval

   }

   
   $scope.prgNoInsSubmission =  function( prgData, noInsData){
        var baseurl = 'http://www.militaryinstallations.dod.mil/MOS/f?p=132:CONTENT:::NO::P4_INST_ID,P4_CONTENT_DIRECTORY,P4_ZIP,P4_DST,P4_TAB:' 
        //resturl = 'getIDfromInstype(selIns, BasesModel)' + "," + 'getIDfromPrograms(selPrg, ProgramsModel)' 
        var tinyurl = ',,10,IC'
        var arrurlsval = [];
        if (typeof(noInsData) == 'undefined')
            {                
                
                for (nitem in getArrayCol (BasesModel)){
                    insid = getIDfromInstype(BasesModel[nitem].name, BasesModel);
                    prgid = prgData;
                    arrurlsval.push(baseurl + insid + ',' + prgid + tinyurl);
                    //arrurlsval.push(baseurl + insid + ',' + prgid + tinyurl, BasesModel[nitem].name, prgData);
                    //alert (arrurlsval);
                    $scope.setUrls = arrurlsval;
                }
            }
        
      }
      
    $scope.multipleVlaue = $scope.example9model;
    //$scope.singleInsVlaue = $scope.ins.selected;
    //alert ($scope.ins.selected);

    function samefromclose(InsData, prgData){
        
        var arrcollectContact = [];
        if (typeof(InsData) != 'undefined'){
            for (items in CardDataModel){
                if (CardDataModel[items]. installation == InsData){
                    for (prgsitems in  prgData){
                            if (CardDataModel[items].programs ==  prgData[prgsitems]){
                                arrcollectContact.push(CardDataModel[items].contact)
                            }
                        }           
                    }
            }
        }
                
        if (typeof(InsData) == 'undefined' || (InsData === '')) {
            
            for (prgsitems in  prgData){
                if (prgData[prgsitems] == 'ALL'){
                   arrcollectContact = ['Belvoir Auto', 'Bragg Dental', 'Campbell Auto', 'Campbell Dental']
                }
                else if (prgData[prgsitems] == 'Auto'){
                   arrcollectContact = ['Belvoir Auto' , 'Campbell Auto']
                }
                else if (prgData[prgsitems] == 'Dental'){
                   arrcollectContact = ['Bragg Dental' , 'Campell Dental']
                }
           } 
        }
        $scope.setContacts = arrcollectContact;
        
    }
    
    $scope.prgInsSingleSelect = function baba(InsData, prgData){
        var arrcollectContact = [];
        if (typeof(InsData) != 'undefined'){
            for (items in CardDataModel){
                if (CardDataModel[items]. installation == InsData){
                    for (prgsitems in  prgData){
                            if (CardDataModel[items].programs ==  prgData[prgsitems]){
                                arrcollectContact.push(CardDataModel[items].contact)
                            }
                        }           
                    }
            }
        }
        if (typeof(InsData) == 'undefined' || (InsData === '')) {
            for (prgsitems in  prgData){
                if (prgData[prgsitems] == 'ALL'){
                   arrcollectContact = ['Belvoir Auto', 'Bragg Dental', 'Campbell Auto', 'Campbell Dental']
                }
                else if (prgData[prgsitems] == 'Auto'){
                   arrcollectContact = ['Belvoir Auto' , 'Campbell Auto']
                }
                else if (prgData[prgsitems] == 'Dental'){
                   arrcollectContact = ['Bragg Dental' , 'Campell Dental']
                }
           } 
        }
        $scope.setContacts = arrcollectContact;
        
    }

    $scope.toggleValue2 = function (){
        alert ('hello');
    }

     $scope.remove = function(item, insd, prgd) { 
        var index = $scope.multipleVlaue.indexOf(item);
         //console.log($scope.multipleVlaue);
         $scope.multipleVlaue.splice(index, 1);  
         samefromclose(insd,prgd );
    };

    $scope.removeIns = function(insdo, prgdo) { 
         $scope.ins.selected = ''; 
         insdo = '';
         samefromclose(insdo,prgdo);
    };

}]);


// Contgroller # 2
myapp.controller('MIDetailsController', function ($scope, $routeParams, MyService, $location, $http,$resource, $window) {
$scope.data = {
    availableOptions: [
      {id: '3760', name: 'Fort Bragg'},
      {id: '2695', name: 'Fort Campbell'},
      {id: '4375', name: 'Fort Bliss'},
      {id: '3070', name: 'Fort Detrick'},
      {id: '835', name: 'Fort Carson'}
    ]

};

$scope.myFunc = function(selectedOption) {
        $window.open('http://www.militaryinstallations.dod.mil/MOS/f?p=132:CONTENT:::NO::P4_INST_ID,P4_INST_TYPE:' + selectedOption.id)
        }   


       
/*var url = "http://mos4-dev.militaryonesource.mil:8080/api/jsonws/installations-service-plugin-portlet.installation/get-installations";
$http({
    method: 'JSONP',
    dataType: 'jsonp',
    X-Content-Type-Options: 'nosniff',
    url: url
}).
success(function(status) {
    //your code when success
    $scope.getall = result.data;
}).
error(function(status) {
    //your code when fails
     $scope.getall = ""
});



    var config = {headers:  {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                crossDomain : true
        }
    };

            $http.jsonp('http://mos4-dev.militaryonesource.mil:8080/api/jsonws/installations-service-plugin-portlet.installation/get-installations', {headers:{'Content-Type': 'application/json; charset=utf-8'}})
                .success(function(data) {
                    $scope.getall = eval(data);
                    console.log(data)
                })
                .error(function(data) {
                    alert(data);
                    console.log('Error: ' + data);
                });

    */   
    //var postUsers = $http.get('http://mos4-dev.militaryonesource.mil:8080/api/jsonws/installations-service-plugin-portlet.installation/get-installations')

         //postUsers.then(function(result) {
       // $scope.getall = result.data;
        
   // });

    
/*var resource = $resource("http://mos4-dev.militaryonesource.mil:8080/api/jsonws/installations-service-plugin-portlet.installation/get-installations",
        {
           callback: "JSON_CALLBACK",
           headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Content-Type-Options':'nosniff'
            }

        },
        {
            getInstal: { method: "GET" }
        }
    );

    resource.getInstal().$promise.then(
                            function (resultset) {
                                $scope.getall = "hello world";
                            },
                            function (error) {
                                console.log("Error");
                            }
                        );*/
   


});



