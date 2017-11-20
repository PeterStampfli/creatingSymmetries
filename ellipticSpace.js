"use strict";

// parameters for elliptic space
var rCircleElliptic,xCenterCircleElliptic,yCenterCircleElliptic;

// intersection of straight lines with unit circle (radius=1)
// find position of unit circle
// inverted for elliptic case

yCenterCircleElliptic=-Math.cos(alpha);
xCenterCircleElliptic=-(Math.cos(alpha)*Math.cos(gamma)+Math.cos(beta))/Math.sin(gamma);

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
		colorPosition.x*=inputImagePosition.reduceAngle(nSymmCenter);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else if (!inputImagePosition.circleInversionOutsideIn(xCenterCircleElliptic,yCenterCircleElliptic,rCircleElliptic)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
		}
	}
	inputImagePosition.reduceAngleSmooth(nSymmCenter);
	inputImagePosition.scale(scale);
}