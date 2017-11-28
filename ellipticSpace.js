"use strict";



var ellipticScale=20;

//  rotational symmetry at center
var ellipticNCenter=6;
// rotational symmetry at left corner
var ellipticNRight=2;
// rotational symmetry at right corner
var ellipticNLeft=2;

// angles
var ellipticAlpha=Math.PI/ellipticNLeft;
var ellipticBeta=Math.PI/ellipticNRight;
var ellipticGamma=Math.PI/ellipticNCenter;

// parameters for elliptic space
var rCircleElliptic,xCenterCircleElliptic,yCenterCircleElliptic;

// intersection of straight lines with unit circle (radius=1)
// find position of unit circle
// inverted for elliptic case

yCenterCircleElliptic=-Math.cos(ellipticAlpha);
xCenterCircleElliptic=-(Math.cos(ellipticAlpha)*Math.cos(ellipticGamma)+Math.cos(ellipticBeta))/Math.sin(ellipticGamma);

// rescale to smaller circle, space goes initially from -0.5 to 0.5

rCircleElliptic=0.7;
xCenterCircleElliptic*=rCircleElliptic;
yCenterCircleElliptic*=rCircleElliptic;


// poincare disc
function elliptic(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	while (!isFinished){
		colorPosition.x*=inputImagePosition.reduceAngle(ellipticNCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else if (!inputImagePosition.circleInversionOutsideIn(xCenterCircleElliptic,yCenterCircleElliptic,rCircleElliptic)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
		}
	}
	inputImagePosition.reduceAngleSmooth(ellipticNCenter);
	inputImagePosition.scale(ellipticScale);
	return true;
}