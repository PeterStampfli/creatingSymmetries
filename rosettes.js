"use strict";

// basic rosettes for kaleidoscopes
var rosette={};

rosette.scale=20;

// variable parameter related to symmetry
// only center is irrelevant (==infinity)
rosette.setup=function(center,left,right){
	rosette.nCenter=center;
}

// the map
rosette.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	inputImagePosition.set(spacePosition);

	colorPosition.x=inputImagePosition.rotationMirrorSymmetry(poincareDisc.nSymmCenter);

	basicRosette(inputImagePosition,rosette.nCenter);
	inputImagePosition.scale(rosette.scale);
	return true;
}