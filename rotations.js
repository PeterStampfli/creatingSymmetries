"use strict";

// rotational symmetry only in something like a poincare disk
// one circle per sector, touching


var rotationScale=20;

//  rotational symmetry at center
var rotationNCenter=4;
var rotationGamme=Math.PI/rotationNCenter;

var rotationCenterX=0.5;
var rotationCenterY=0.5*Math.tan(rotationGamme);
console.log("yyy "+rotationCenterY);


// poincare disc??
function rotation(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		return false;
	}
	while (!isFinished){
		inputImagePosition.rotationSymmetry(rotationNCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else if (!inputImagePosition.circleInversionInsideOut(rotationCenterX,rotationCenterY,rotationCenterY)){
			isFinished=true;
		}
		else {
			colorPosition.x=-colorPosition.x;
		}
	}
	basicRosette(inputImagePosition,rotationNCenter);
	inputImagePosition.scale(scale);
	return true;
}

