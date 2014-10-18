angular.module("groomMaPosse", []);


angular.module("groomMaPosse").controller("Main", function($scope, $http) {
    $scope.hello = "Test";

    $scope.login = function() {
        window.location = '/login';
    };
});
