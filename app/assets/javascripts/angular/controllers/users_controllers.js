var myApplication = angular.module('myapplication', ['ngRoute', 'ngResource']);

myApplication.factory('Users', ['$resource', function($resource){
  return $resource('/users.json', {}, {
  	query: { method: 'GET', isArray: true},
  	create: { method: 'POST' }
  })
}]);

myApplication.factory('User', ['$resource', function($resource){
  return $resource('/users/:id.json', {}, {
  	show: { method: 'GET' },
  	update: { method: 'PUT', params: {id: '@id'} },
  	delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);

// Controller

myApplication.controller("UserAddCtr", ['$scope', '$resource', 'Users', '$location', function($scope, $resource, Users, $location){
  $scope.user = {
  	"first_name": '',
  	"last_name": '',
  	"email": ''
  }
  $scope.save = function() {
  	if ($scope.userForm.$valid){
  		Users.create({user: $scope.user}, function(){
  			$location.path('/');
  		}, function(error){
  			console.log(error);
  		});
  	}
  }
}]);

myApplication.controller("UserUpdateCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams){
  $scope.user = User.get({id: $routeParams.id});
  $scope.update = function(){
  	if($scope.userForm.$valid){
  		User.update($scope.user, function(){
  			$location.path('/');
  		}, function(error) {
  			console.log(error);
  		});
  	}
  }
}]);

myApplication.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location){
  $scope.users = [];
  $scope.users = Users.query();

  $scope.deleteUser = function(userId){
  	if(confirm("Are you sure you want to delete this user?")){
  		User.delete({ id: userId }, function(){
  			$scope.users = Users.query(); // get the users collection after deleting user
  			$location.path('/');
  		});
  	}
  };
}]);

// Routes
myApplication.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  	$routeProvider.when('/users', {
  		templateUrl: '/templates/users/index.html',
  		controller: 'UserListCtr'
  	});
  	$routeProvider.when('/users/new', {
  		templateUrl: '/templates/users/new.html',
  		controller: 'UserAddCtr'
  	});
  	$routeProvider.when('/users/:id/edit', {
  		templateUrl: '/templates/users/edit.html',
  		controller: 'UserUpdateCtr'
  	});
  	$routeProvider.otherwise({
  		redirectTo: '/users'
  	});
  }
]);