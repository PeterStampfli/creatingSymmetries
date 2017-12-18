"use strict";

// rotational symmetry only in something like a poincare disk
// one circle per sector, touching


var rotationScale=20;

//  rotational symmetry at center
var rotationNCenter=5;
var rotationGamma=Math.PI/rotationNCenter;
var rotationNExtra=2;
var rotationAlpha=Math.PI/rotationNExtra;

var rotationCenterX=Math.cos(rotationGamma);
var rotationCenterY=Math.sin(rotationGamma);


var rotationCircleRadius=rotationCenterY/Math.cos(rotationAlpha/2);

var rotationWorldRadius=Math.sqrt(1-rotationCircleRadius*rotationCircleRadius);
rotationCenterX*=0.5/rotationWorldRadius;
rotationCenterY*=0.5/rotationWorldRadius;
rotationCircleRadius*=0.5/rotationWorldRadius;



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
		else if (!inputImagePosition.circleInversionInsideOut(rotationCenterX,rotationCenterY,rotationCircleRadius)){
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


var innerRadius=Math.sqrt(rotationCenterX*rotationCenterX+rotationCenterY*rotationCenterY)-rotationCenterY;
// poincare disc??
function rotationPlus(inputImagePosition,colorPosition,spacePosition,canvasPosition){
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
		isFinished=true;
		if (iter>iterMax){
			return false;
		}
		if (inputImagePosition.circleInversionInsideOut(rotationCenterX,rotationCenterY,rotationCenterY)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
		if (inputImagePosition.circleInversionInsideOut(0,0,innerRadius)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
		if (inputImagePosition.circleInversionOutsideIn(0,0,0.5)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
	}
	basicRosette(inputImagePosition,rotationNCenter);
	inputImagePosition.scale(scale);
	return true;
}



// poincare disc??
function rotation3circles(inputImagePosition,colorPosition,spacePosition,canvasPosition){
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
		isFinished=true;
		if (inputImagePosition.circleInversionInsideOut(rotationCenterX,rotationCenterY,rotationCenterY)){
			colorPosition.x=-colorPosition.x;
			isFinished=false;
		}
		if (inputImagePosition.circleInversionOutsideIn(0,0,0.2)){
			colorPosition.x=-colorPosition.x;
			isFinished=false;
		}
		if (inputImagePosition.circleInversionInsideOut(0,0,0.15)){
			colorPosition.x=-colorPosition.x;
			isFinished=false;
		}
	}
	basicRosette(inputImagePosition,rotationNCenter);
	inputImagePosition.scale(scale);
	return true;
}
