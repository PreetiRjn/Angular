var kabi = angular.module("Kabi",['ngRoute']);

kabi.config(function($routeProvider){
$routeProvider.when('/',{templateUrl:'views/home.html'})
.when('/home',{templateUrl:'views/home.html'})
.when('/header',{template:'<headerkabi></headerkabi>'})
.when('/footer',{templateUrl:'views/footer.html'})
.when('/meddevice',{templateUrl:'views/meddevice.html'})
.when('/pharma',{templateUrl:'views/pharma.html'})
.otherwise({template : "<h1>None</h1><p>Nothing has been selected</p>"});
});

kabi.controller('homeController',function($scope,$location,$timeout,$interval,$http,hexfy){
    $scope.urlPath = $location.absUrl();
    $scope.mesg = 'hiiiiiiiiiiiiii';
    $scope.timenow = new Date().toLocaleTimeString();
    $timeout(function(){
        $scope.mesg = 'Hello';
    },2000);
    $interval(function(){
        $scope.timenow = new Date().toLocaleTimeString();
    },1000);
    $scope.hex = hexfy.myfunc(255);
    $http.get("JSONdata/meddevice.json").then(function(response){$scope.contacts = response.data.records});
    $scope.names = ['Jani', 'Carl', 'Margareth', 'Hege', 'Joe', 'Gustav', 'Birgit', 'Mary', 'Kai'];
});
kabi.service('hexfy', function(){
    this.myfunc = function(x){
        return x.toString(16);
    }
});

kabi.filter('myFilter',function(){
    return function(x){
        var i, c, txt = "";
        for (i = 0; i < x.length; i++) {
            c = x[i];
            if (i % 2 == 0) {
                c = c.toUpperCase();
            }
            txt += c;
        }
        return txt;
    }
});
/*
kabi.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise({template : "<h1>None</h1><p>Nothing has been selected</p>"});
$stateProvider.state('home',{url:'/home',templateUrl:'views/home.html'})
.state('header',{url:'views/header',templateUrl:'views/header.html'})
.state('footer',{url:'views/footer',templateUrl:'views/footer.html'});
});*/