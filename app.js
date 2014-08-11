/* global angular, $, console */
var tagesbedarf = angular.module("tagesbedarf", ["ui.bootstrap", "nvd3ChartDirectives"]);

tagesbedarf.controller(
    "AppCtrl",
    function($scope) {

		$scope.currentselectedFoodName = undefined;
		$scope.lastSelectedFoodName = undefined;
		$scope.availableFoodNames = [];

		initAutocomplete($scope);

		$scope.onSelect = function ($item) {

			$scope.currentSelectedFoodObject = $scope.availableFoodObjects[$item];
			$scope.lastSelectedFoodName = $scope.currentSelectedFoodName;
			$scope.currentSelectedFoodName = "";

			buildMacronutrientGraph();

		};

		var colorArray = ["#1F77B4", "#AEC7E8", "#FF7F0E", "#FFBB78"];
		$scope.colorFunction = function() {
			return function(d, i) {
				return colorArray[i];
			};
		};

		$scope.xFunction = function() {
			return function(d) {
				return d.key;
			};
		};

		$scope.yFunction = function(){
			return function(d){
				return d.y;
			};
		};

		var buildMacronutrientGraph = function() {
			$scope.exampleData = [];
			var macronutrients = ["Fett", "Eiweiß", "Kohlenhydrate", "Ballaststoffe"];
			var gram = 0;
			for(var byIndex in macronutrients) {
				gram = $scope.currentSelectedFoodObject[macronutrients[byIndex]];
				gram = (gram === undefined) ? 0 : gram;
				$scope.exampleData.push({key: macronutrients[byIndex], y: gram});
			}

		};

    } // scope
    
); // controller

var initAutocomplete = function($scope) {

    $("#input").focus();
	
    $.getJSON(
		"food.json"
    ).success(
		function(data) {
			
			var foodNames = [];
			for(var food in data) {
				foodNames.push(food);
			}
			$scope.availableFoodNames = foodNames;
			$scope.availableFoodObjects = data;
		
		}
    ).error(
		function(jqXHR, textStatus) {
			console.log("error " + textStatus + ", incoming Text " + jqXHR.responseText);
		}
    );

};
