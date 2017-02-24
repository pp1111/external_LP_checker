var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

var refresh = function() {
  $http.get('/website').success(function(response) {
    console.log("I got the data I requested");
    $scope.websites = response;
    $scope.website = "";
  });
};

refresh();

$scope.addwebsite = function() {
  console.log($scope.website);
  $http.post('/website', $scope.website).success(function(response) {
    console.log(response);
    refresh();
  });
};

$scope.remove = function(id) {
  console.log(id);
  $http.delete('/website/' + id).success(function(response) {
    refresh();
  });
};

$scope.edit = function(id) {
  console.log(id);
  $http.get('/website/' + id).success(function(response) {
    $scope.website = response;
  });
};  


$scope.deselect = function() {
  $scope.website = "";
}

}])