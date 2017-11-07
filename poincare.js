"use strict";

// parameters
// multiplicity of the symmetry at intersection of circles
var nSymmCircleIntersection=4;
//poincare circle
// number of corners= rotational symmetry at center
var nCorners=7;



// radius of circles for distance between circle centers equal to 1
var radiusPoincarePlane=0.5/Math.cos(Math.PI/nSymmCircleIntersection);

//length of the side of a polygon with given number of corners and vertical side at distance 0.5 from center
// 0.5 is radius of inscribed circle
var sideLength=0.5*Math.tan(3.14159/nCorners);



// the poincare plane
// distance between circle centers is 1


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






// first variant: center of circle at center of sides
function poincarePolygon(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;			
	inputImagePosition.set(spacePosition);
	while (!isFinished){
		inputImagePosition.reduceAngle(nCorners);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}

		else if (!inputImagePosition.circleInversion(0.5,0,sideLength)){
			isFinished=true;
		}
	}
	if (inputImagePosition.x>0.5){
		inputImagePosition.x=100000;
	}
	else {
		inputImagePosition.reduceAngleSmooth(nCorners);
	}
}


// second variant: center of inversion circle at corners
function otherPoincarePolygon(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;		
	inputImagePosition.set(spacePosition);
	while (!isFinished){
		inputImagePosition.reduceAngle(nCorners);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else if (!inputImagePosition.circleInversion(0.5,sideLength,2*sideLength)){
			isFinished=true;
		}
	}
	if (inputImagePosition.x>0.5){
		inputImagePosition.x=100000;
	}
	else {
		inputImagePosition.reduceAngleSmooth(nCorners);
	}
}