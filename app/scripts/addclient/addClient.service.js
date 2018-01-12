/**
 * http://usejsdoc.org/
 */


angular.module('spApp').service('sharedProperties', function () {
        var username = 'test'; 
        return {
        	getProperty: function () {
                return username;
            },
            setProperty: function(value) {
            	username = value;
            }
        };
    });
/*var appServices = angular.module('spApp',[]);
appServices.factory('Upload',['$http',function($http){
    return{
        upload : function(file){
            return $http.post('http://localhost:3000/api/editClient', file);
        }
    }
}]);*/
