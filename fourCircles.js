"use strict";


function fourCircles(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		return false;
	}
	while (!isFinished){
		colorPosition.x*=inputImagePosition.rotationMirrorSymmetry(2);
		iter++;
		if (iter>iterMax){
			return false;
		}
		isFinished=true;
		if (inputImagePosition.circleInversionInsideOut(0,0.5,0.5)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
		else if (inputImagePosition.circleInversionInsideOut(0,0.86602,0.5)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
		if (inputImagePosition.circleInversionOutsideIn(0,0,0.5)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
	}
	basicRosette(inputImagePosition,2);
	inputImagePosition.scale(scale);
	return true;
}

var fiveCircleRadius=0.707/4;

function threeCircles(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		return false;
	}
	while (!isFinished){
		colorPosition.x*=inputImagePosition.rotationMirrorSymmetry(2);
		iter++;
		if (iter>iterMax){
			return false;
		}
		isFinished=true;
		if (inputImagePosition.circleInversionInsideOut(0.25,0,0.4)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
		if (inputImagePosition.circleInversionOutsideIn(0,0,0.5)){
			isFinished=false;
			colorPosition.x=-colorPosition.x;
		}
	}
	basicRosette(inputImagePosition,2);
	inputImagePosition.scale(scale);
	return true;
}
