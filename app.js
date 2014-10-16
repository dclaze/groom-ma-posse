angular.module("groomMaPosse", []);


angular.module("groomMaPosse").controller("Main", function($scope, $http){
	$scope.hello = "Test";

	$scope.login = function(){
		$http.get('/login')
		.success(function(response){
			console.log(response);
		})
		.error(function(response){
			console.log(response);
		})	
	};
});