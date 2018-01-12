'use strict';
var spApp = angular.module('spApp');
spApp.controller('analysisController', ['$scope', '$location', '$http', '$timeout', '$rootScope', '$localStorage', function($scope, $location, $http, $timeout, $rootScope, $localStorage) {
    angular.element('#accordion a').click(function(e) {
        e.preventDefault();
    });
    $http({
        method : "GET",
        url : "data/analysis.json"
    }).then(function (result) {
        $scope.getanalysisdata=result.data.analysisData;
    });
    // drag and drop start
     $scope.uniqueXaxis = []; 
     $scope.uniqueYaxis = []; 
     $scope.xaxis = function(event, ui){
        $scope.uniqueXaxis = $scope.uniqueXaxis.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        })
    };
    $scope.yaxis = function(event, ui){
        $scope.uniqueYaxis = $scope.uniqueYaxis.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        })
    };
    $scope.closeXaxis=function (index) {
        if (index > -1) {
            $scope.uniqueXaxis.splice(index, 1);
        }
    }
    $scope.closeYaxis=function (index) {
        if (index > -1) {
            $scope.uniqueYaxis.splice(index, 1);
        }
    }
    // Drag and drop function end
    
    // chart part integration start
    $scope.chartdata = [
        { name: 'A', upload: 200 },
        { name: 'B', upload: 100 },
        { name: 'C', upload: 300 },
        { name: 'D', upload: 400 },
    ];
    $scope.barchart = function() {
        var barchart = c3.generate({
            bindto: '#barchart',
            data: {
                json: $scope.chartdata,
                keys: {
                    x: 'name',
                    value: ['upload', 'download'],
                },
                type: 'bar'
            },
            axis: {
                rotated: true,
                x: {
                    type: 'categorized'
                }
            },
            bar: {
                width: {
                    ratio: 0.3
                },
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            legend: {
                show: false
            }
        });
    }
    $scope.barchart();
    $scope.linechart=function () {
        var barchart = c3.generate({
            bindto: '#barchart',
            data: {
                json: $scope.chartdata,
                keys: {
                    x: 'name',
                    value: ['upload', 'download'],
                },
                type: 'line'
            },
            axis: {
                rotated: false,
                x: {
                    type: 'categorized'
                }
            },
            bar: {
                width: {
                    ratio: 0.3
                },
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            legend: {
                show: false
            }
        });
    }
    // chart end 

}])
