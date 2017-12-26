"use strict";

// parameters
var scale=20;
// poincare circle: rotational symmetry at center
var nSymmCenter=6;
//poincare circle and plane
// rotational symmetry at left corner
var nSymmLeft=2;
// rotational symmetry at right corner
var nSymmRight=3;

// angles
var alpha=Math.PI/nSymmLeft;
var beta=Math.PI/nSymmRight;
var gamma=Math.PI/nSymmCenter;

// poincare disc

var xCenterCircle,yCenterCircle,rCircle,worldRadius;

// intersection of straight lines with unit circle (radius=1)
// find position of unit circle

yCenterCircle=Math.cos(alpha);
xCenterCircle=(Math.cos(alpha)*Math.cos(gamma)+Math.cos(beta))/Math.sin(gamma);
var r2=xCenterCircle*xCenterCircle+yCenterCircle*yCenterCircle;
console.log("unit circle at ("+xCenterCircle+","+yCenterCircle+")");
console.log("distance "+Math.sqrt(r2));

worldRadius=Math.sqrt(r2-1);
console.log("world radius "+worldRadius);

// rescale world radius to be 0.5
rCircle=0.5/worldRadius;
yCenterCircle*=0.5/worldRadius;
xCenterCircle*=0.5/worldRadius;



function poincarePlaneMapping(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;
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
			return false;
		}
		else if (!inputImagePosition.circleInversionInsideOut(xCenterPlane,0,rPlane)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
		}
	}
	inputImagePosition.x=0.5*imageFastFunction.periodicMapping(inputImagePosition.x);
	return true;
}

// poincare disc
function poincareDisc(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		return false;
	}
	while (!isFinished){
		colorPosition.x*=inputImagePosition.rotationMirrorSymmetry(nSymmCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else if (!inputImagePosition.circleInversionInsideOut(xCenterCircle,yCenterCircle,rCircle)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
		}
	}
	basicRosette(inputImagePosition,nSymmCenter);
	inputImagePosition.scale(scale);
	return true;
}


// only the polygon
function polygon(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	inputImagePosition.set(spacePosition);
	inputImagePosition.rotationMirrorSymmetry(nSymmCenter);
	if (inputImagePosition.x>0.5){
		return false;
	}
	else {
		inputImagePosition.rotationMirrorSmooth(nSymmCenter);
	}
	inputImagePosition.scale(scale);
	return true;
}