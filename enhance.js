"use strict"

var colorMin,colorMax;

function colorMinMax(){
	var locOutputPixels=outputPixels;
    var mapSize=mapX.length;
    var mini=1000;
    var maxi=-1000;

    var outputIndex=0;

    for (var mapIndex=0;mapIndex<mapSize;mapIndex++){
    	maxi=Math.max(maxi,locOutputPixels[outputIndex]);
    	mini=Math.min(mini,locOutputPixels[outputIndex++]);
    	maxi=Math.max(maxi,locOutputPixels[outputIndex]);
    	mini=Math.min(mini,locOutputPixels[outputIndex++]);
    	maxi=Math.max(maxi,locOutputPixels[outputIndex]);
    	mini=Math.min(mini,locOutputPixels[outputIndex]);
    	outputIndex+=2;

    }

console.log
console.log("max "+maxi);
console.log("min "+mini);
}