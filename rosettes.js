"use strict";

// basic rosettes for kaleidoscopes
var rosette={};

// variable parameter related to symmetry
// only center is irrelevant (==infinity)
rosette.setup=function(center,left,right){
	rosette.nCenter=center;
}

// the map
rosette.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	inputImagePosition.set(spacePosition);
	basicRosette(inputImagePosition,rosette.nCenter);
	return true;
}