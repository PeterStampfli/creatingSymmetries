"use strict";



var ellipticScale=20;

//  rotational symmetry at center
var ellipticNCenter=3;
// rotational symmetry at left corner
var ellipticNRight=2;
// rotational symmetry at right corner
var ellipticNLeft=3;

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

// elliptic kaleidoscope
function elliptic(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	while (!isFinished){
		colorPosition.x*=inputImagePosition.rotationMirrorSymmetry(ellipticNCenter);
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
	basicRosette(inputImagePosition,nSymmCenter);
	inputImagePosition.scale(ellipticScale);
	return true;
}