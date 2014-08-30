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
			"Ballaststoffe": "#FFBB78",
			"Zucker": "red"
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

		var pushToGraphData = function(nutrient, gram) {
			$scope.macroGraphData.push({key: nutrient, y: gram, color: colorsByName[nutrient]});
		};

		var buildMacronutrientGraph = function() {

			$scope.macroGraphData = [];
			var macronutrients = ["Fett", "Eiweiß", "Kohlenhydrate", "Ballaststoffe"];
			var gramTotal = 0, gramSugar = 0;
			var KEY_SUGAR = "Zucker";
			var currentFoodFeat, currNutrient;

			for(var byIndex in macronutrients) {

				currNutrient = macronutrients[byIndex];
				currentFoodFeat = $scope.currentSelectedFoodObject[currNutrient];

				if(currentFoodFeat === undefined) {

					pushToGraphData(currNutrient, 0);
					
				} else if(currNutrient === "Kohlenhydrate") {
					
					gramTotal = currentFoodFeat.total;
					gramSugar = (currentFoodFeat[KEY_SUGAR] === undefined) ? 0 : currentFoodFeat[KEY_SUGAR];
					pushToGraphData(currNutrient, gramTotal - gramSugar);
					pushToGraphData(KEY_SUGAR, gramSugar);

				} else if(currNutrient === "Fett") {

					pushToGraphData(currNutrient, currentFoodFeat.total);
					
				} else {

					pushToGraphData(currNutrient, currentFoodFeat);
					
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
