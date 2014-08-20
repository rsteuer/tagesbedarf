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

		$scope.printFoodValue = function(value) {
			
			if(typeof(value) === "number") {
				return value;
			} else if(typeof(value) === "object") {
				return value.total;
			}

			return value;
			
		};

		var colorArray = ["#1F77B4", "#AEC7E8", "#FF7F0E", "red", "#FFBB78"];

		var colorsByName = {
			"Kohlenhydrate": "#FF7F0E",
			"Fett": "#1F77B4",
			"Eiweiß": "#AEC7E8",
			"Ballaststoffe": "#FFBB78"			
		};

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
			var gram = 0, gramTotal = 0, gramSugar = 0;
			var KEY_SUGAR = "Zucker";
			var currentFoodFeat;

			for(var byIndex in macronutrients) {

				currentFoodFeat = $scope.currentSelectedFoodObject[macronutrients[byIndex]];

				if(currentFoodFeat === undefined) {

					$scope.exampleData.push({key: macronutrients[byIndex], y: 0, color: colorsByName[macronutrients[byIndex]]});

				} else if(macronutrients[byIndex] === "Kohlenhydrate") {
					
					gramTotal = currentFoodFeat.total;
					gramSugar = (currentFoodFeat[KEY_SUGAR] === undefined) ? 0 : currentFoodFeat[KEY_SUGAR];

					$scope.exampleData.push({key: macronutrients[byIndex], y: gramTotal - gramSugar, color: colorsByName[macronutrients[byIndex]]});
					$scope.exampleData.push({key: KEY_SUGAR, y: gramSugar, color: "red"});
					
				} else {

					gram = currentFoodFeat;
					$scope.exampleData.push({key: macronutrients[byIndex], y: gram, color: colorsByName[macronutrients[byIndex]]});
					
				}

			} // for all macronutrients

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
