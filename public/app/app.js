/* Register angular module with custom name myapp, all other Angular objects will add it to this custom angular module, 
Here Other Anulag objects used are Controller, Service, RouteProvider etc. */

var myapp = angular.module('myapp', ['ngRoute', 
                'ngResource',
                "ui.bootstrap",
                'ngSanitize',
                'angularjs-dropdown-multiselect',
                'ngTable'
                ])
    
    

    myapp.factory("BasesModel", function(){
            var arravailableOptions= [
            {id: '4810', name: 'Fort Belvoir'},
            {id: '3760', name: 'Fort Bragg'},
            {id: '2695', name: 'Fort Campbell'}
            //,
            //{id: '4375', name: 'Fort Bliss'},
            //{id: '3070', name: 'Fort Detrick'},
            //{id: '835', name: 'Fort Carson'}    
        ]
            return arravailableOptions;
    });
    
    
    myapp.factory("StateModel", function(){
            var arravailableOptions= [
            {id: '320020',  state:'Indiana'},
            {id: '320021',  state:'Kansas'},
            {id: '320022',  state:'Kentucky'},
            {id: '320023',  state:'Louisiana'},
            {id: '320024',  state:'Massachusetts'}
    
        ]
            return arravailableOptions;
    }); 
        
    myapp.factory("CardDataModel", function(){
            var arravailableOptions= [
            {installation: 'Fort Belvoir',  programs:'auto', contact:'Belvoir auto' },
            {installation: 'Fort Bragg',  programs:'dental', contact:'Brag dental'},
            {installation: 'Fort Campbell',  programs:'auto', contact:'Campbell auto'},
            {installation: 'Fort Campbell',  programs:'dental', contact:'Campbell dental'}
    
        ]
            return arravailableOptions;
    });


    myapp.factory("ProgramsModel", function(){
            var arrProgramsOptions= [
            {id: 'ALL',  programs:'ALL'},
            {id: '44',  programs:'Chapels'},
            {id: '43',  programs:'Beauty/Barber Shops'},
            {id: '42',  programs:'Barracks/Single Service Member Housing'},
            {id: '41',  programs:'Automotive Services'},
            {id: '40',  programs:'Legal Services/JAG'},
            {id: '39',  programs:'Household Goods/Transportation Office (outbound)'},
            {id: '31',  programs:'Youth Programs/Centers'}
        ]
            return arrProgramsOptions;
    }); 
    

   



         myapp.config(function ($routeProvider) {
             $routeProvider.
                when('/persondelete/:id', {
                    templateUrl: 'app/views/persondelete.html',
                    controller: 'PersonDetailsController'
                }).
                when('/person/:id', {
                    templateUrl: 'app/views/listperson.html',
                    controller: 'PersonDetailsController'
                }).
                when('/allperson', {
                    templateUrl: 'app/views/allperson.html',
                    controller: 'MyController'
                }).             
                when('/addperson', {
                    templateUrl: 'app/views/addperson.html',
                    controller: 'MyController'
                }).
                when('/personsearch', {
                    templateUrl: 'app/views/personsearch.html',
                    controller: 'MyController'
                }).
                when('/personupdate/:id', {
                    templateUrl: 'app/views/personupdate.html',
                    controller: 'PersonDetailsController'
                }).
                when('/mi', {
                    templateUrl: 'app/views/mi.html',
                    controller: 'MIDetailsController'
                }).
                when('/type', {
                    templateUrl: 'app/views/type.html',
                    controller: 'typeController'
                }).
                
                otherwise({
                    redirectTo: '/type'
                });
            });

            

     
