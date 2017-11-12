"use strict";

// parameters
var scale=20;
// poincare circle: rotational symmetry at center
var nSymmCenter=5;
//poincare circle and plane
// rotational symmetry at left corner
var nSymmLeft=2;
// rotational symmetry at right corner
var nSymmRight=3;

// angles
var alpha=Math.PI/nSymmLeft;
var beta=Math.PI/nSymmRight;
var gamma=Math.PI/nSymmCenter;

// the poincare plane
// distance between circle centers is 1
// limit nSymmCenter -> infinity

var rPlane=0.5/(Math.cos(alpha)+Math.cos(beta));
var xCenterPlane=rPlane*Math.cos(alpha);

// poincare disc
// 0.5 is radius of inscribed circle of the polygon bearing the center of inversion circles

var yCenterCircle=0.5*Math.tan(gamma)/(1+Math.cos(beta)*(1+Math.tan(gamma)*Math.tan(gamma)));
var rCircle=yCenterCircle/Math.cos(alpha);

console.log("inversionCircleRadius "+rCircle);
var dCircle=Math.sqrt(0.25+yCenterCircle*yCenterCircle);
console.log("center inversion distance from origin "+dCircle);
var worldRadius=Math.sqrt(dCircle*dCircle-rCircle*rCircle);
console.log("world radius "+worldRadius);

rCircle*=0.5/worldRadius;
yCenterCircle*=0.5/worldRadius;
var xCenterCircle=0.25/worldRadius;


function poincarePlane(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;
	colorPosition.x=1;                                        // as parity for 2 colors
	inputImagePosition.set(spacePosition);
	while (!isFinished){
		iter++;
		inputImagePosition.periodXUnit();
		if (inputImagePosition.x>0.5){
			inputImagePosition.x=1-inputImagePosition.x;
			colorPosition.x=-colorPosition.x;
		}
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else if (!inputImagePosition.circleInversion(xCenterPlane,0,rPlane)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
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
	colorPosition.x=1;                                        // as parity for 2 colors
	while (!isFinished){
		colorPosition.x*=inputImagePosition.reduceAngle(nSymmCenter);
		iter++;
		if ((inputImagePosition.radius2>0.25)||(iter>iterMax)){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else if (!inputImagePosition.circleInversion(xCenterCircle,yCenterCircle,rCircle)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
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