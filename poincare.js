"use strict";

// parameters
var scale=20;
// multiplicity of the symmetry at intersection of circles
var nSymmCircleIntersection=8;
//poincare circle
// number of corners= rotational symmetry at center
var nSymmCenter=3;

// radius of circles for distance between circle centers equal to 1
var radiusPoincarePlane=0.5/Math.cos(Math.PI/nSymmCircleIntersection);

//length of the side of a polygon with given number of corners and vertical side at distance 0.5 from center
// 0.5 is radius of inscribed circle
var sideLength=Math.tan(3.14159/nSymmCenter);

// radius for inversion disc of first model
var radiusDisc=Math.sin(Math.PI/nSymmCenter)*radiusPoincarePlane;

// radius for inversion disc of second model
var radiusInversion=sideLength*radiusPoincarePlane;

// the poincare plane
// distance between circle centers is 1
// limit nSymmCenter -> infinity

function poincarePlane(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;
	inputImagePosition.set(spacePosition);
	while (!isFinished){
		inputImagePosition.periodXUnit();
		inputImagePosition.leftToRightAt(0.5);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else if (!inputImagePosition.circleInversion(0.0,0,radiusPoincarePlane)){
			isFinished=true;
		}
	}
	inputImagePosition.x=0.5*imageFastFunction.periodicMapping(inputImagePosition.x);
}

// poincare disc
function poincareDisc(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;		
	inputImagePosition.set(spacePosition);
	while (!isFinished){
		inputImagePosition.reduceAngle(nSymmCenter);
		iter++;
		if (inputImagePosition.x>0.5){
			inputImagePosition.x=100000;
			isFinished=true;
		}
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else if (!inputImagePosition.circleInversion(0.5,0.5*sideLength,radiusInversion)){
			isFinished=true;
		}
	}
	inputImagePosition.reduceAngleSmooth(nSymmCenter);
	inputImagePosition.scale(scale);
}

// only the polygon
function polygon(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;		
	inputImagePosition.set(spacePosition);
	inputImagePosition.reduceAngle(nSymmCenter);
	if (inputImagePosition.x>0.5){
		inputImagePosition.x=100000;
	}
	else {
		inputImagePosition.reduceAngleSmooth(nSymmCenter);
	}
	inputImagePosition.scale(scale);
}