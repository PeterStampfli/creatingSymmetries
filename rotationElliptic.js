"use strict";


var rotationEllipticScale=20;
var rotationEllipticRadius=0.5;

//  rotational symmetry at center
var rotationEllipticNCenter=3;
var rotationEllpticGamma=Math.PI/rotationEllipticNCenter;
var rotationEllpticNExtra=2;
var rotationEllpticAlpha=Math.PI/rotationEllpticNExtra;

var rotationEllpticCenterX=-rotationEllipticRadius/Math.sqrt(6);
var rotationEllpticCenterY=-rotationEllipticRadius/Math.sqrt(2);


// poincare disc??
function rotationElliptic(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	while (!isFinished){
		inputImagePosition.rotationSymmetry(rotationEllipticNCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else if (!inputImagePosition.circleInversionOutsideIn(rotationEllpticCenterX,rotationEllpticCenterY,rotationEllipticRadius)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
		}
	}
	basicRosette(inputImagePosition,rotationEllipticNCenter);
	inputImagePosition.scale(rotationEllipticScale);
	return true;
}