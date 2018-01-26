"use strict";

// rotational symmetry only in something like a poincare disk
// one circle per sector, touching
var rotation={};

rotation.scale=50;

rotation.setup=function(center,left,right){
	//  rotational symmetry at center
	rotation.nCenter=center;
	rotation.symmetry=right;
	var gamma=Math.PI/rotation.nCenter;
	// rotational symmetry at crossing of circles
	rotation.nExtra=left;
	var alpha=Math.PI/rotation.nExtra;

	rotation.centerX=Math.cos(gamma);
	rotation.centerY=Math.sin(gamma);


	rotation.circleRadius=rotation.centerY/Math.cos(alpha/2);

	var rotationWorldRadius=Math.sqrt(1-rotation.circleRadius*rotation.circleRadius);
	rotation.centerX*=0.5/rotationWorldRadius;
	rotation.centerY*=0.5/rotationWorldRadius;
	rotation.circleRadius*=0.5/rotationWorldRadius;
	rotation.innerRadius=Math.sqrt(rotation.centerX*rotation.centerX+rotation.centerY*rotation.centerY)-rotation.centerY;
}

// poincare disc??
rotation.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		return false;
	}
	while (!isFinished){
		colorPosition.x+=inputImagePosition.rotationSymmetry(rotation.nCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else if (!inputImagePosition.circleInversionInsideOut(rotation.centerX,rotation.centerY,rotation.circleRadius)){
			isFinished=true;
		}
		else {
			colorPosition.x++;
		}
	}
	basicRosette(inputImagePosition,rotation.symmetry);
	inputImagePosition.scale(rotation.scale);
	return true;
}


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
