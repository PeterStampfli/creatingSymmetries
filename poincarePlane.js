"use strict";

// create the object
var poincarePlane={};
// initilization of static parameters
poincarePlane.scale=20;

// variable parameter related to symmetry
// center is irrelevant (==infinity)
poincarePlane.setup=function(center,left,right){
	// rotational symmetry at left corner
	poincarePlane.nSymmLeft=left;
	// rotational symmetry at right corner
	poincarePlane.nSymmRight=right;
	// angles
	var alpha=Math.PI/poincarePlane.nSymmLeft;
	var beta=Math.PI/poincarePlane.nSymmRight;
	// the poincare plane
	// distance between circle centers is 1
	// limit nSymmCenter -> infinity
	poincarePlane.rPlane=0.5/(Math.cos(alpha)+Math.cos(beta));
	poincarePlane.xCenterPlane=poincarePlane.rPlane*Math.cos(alpha);
}

// the mapping method
poincarePlane.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;
	colorPosition.x=1;                                        // as parity for 2 colors
	inputImagePosition.set(spacePosition);
	while (!isFinished){
		isFinished=true;
		iter++;
		inputImagePosition.periodXUnit();
		if (inputImagePosition.x>0.5){
			inputImagePosition.x=1-inputImagePosition.x;
			colorPosition.x=-colorPosition.x;
		}
		if (iter>iterMax){
			return false;
		}
		if (inputImagePosition.circleInversionInsideOut(poincarePlane.xCenterPlane,0,poincarePlane.rPlane)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
	}
	inputImagePosition.x=0.5*imageFastFunction.periodicMapping(inputImagePosition.x);
	return true;
}
