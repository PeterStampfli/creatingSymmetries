"use strict";

// parameters
var scale=20;
// poincare circle: rotational symmetry at center
var nSymmCenter=5;
//poincare circle and plane
// rotational symmetry at left corner
var nSymmLeft=5;
// rotational symmetry at right corner
var nSymmRight=6;

// angles
var alpha=Math.PI/nSymmLeft;
var beta=Math.PI/nSymmRight;
var gamma=Math.PI/nSymmCenter;

// the poincare plane
// distance between circle centers is 1
// limit nSymmCenter -> infinity

var rPlane=0.5/(Math.cos(alpha)+Math.cos(beta));
var xCenterPlane=rPlane*Math.cos(alpha);

console.log(rPlane+" "+xCenterPlane);

// poincare disc
// 0.5 is radius of inscribed circle of the polygon bearing the center of inversion circles

var yCenterCircle=0.5*Math.tan(gamma)/(1+Math.cos(beta)*(1+Math.tan(gamma)*Math.tan(gamma)));
var rCircle=yCenterCircle/Math.cos(alpha);

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
		else if (!inputImagePosition.circleInversion(xCenterPlane,0,rPlane)){
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
		else if (!inputImagePosition.circleInversion(0.5,yCenterCircle,rCircle)){
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