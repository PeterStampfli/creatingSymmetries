"use strict";

var rotationElliptic={};

rotationElliptic.scale=20;
rotationElliptic.baseLength=0.5;

rotationElliptic.setup=function(center,left,right){
//  rotational symmetry at center
	rotationElliptic.nCenter=center;
	rotationElliptic.gamma=Math.PI/rotationElliptic.nCenter;
	rotationElliptic.nExtra=left;
	var alpha=Math.PI/rotationElliptic.nExtra;

	rotationElliptic.centerX=-rotationElliptic.baseLength*Math.cos(rotationElliptic.gamma);
	rotationElliptic.centerY=-rotationElliptic.baseLength*Math.sin(rotationElliptic.gamma);
	rotationElliptic.radius=rotationElliptic.baseLength*Math.sin(rotationElliptic.gamma)/Math.sin(alpha/2);
}

// poincare disc??

rotationElliptic.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	while (!isFinished){
		inputImagePosition.rotationSymmetry(rotationElliptic.nCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else if (!inputImagePosition.circleInversionOutsideIn(rotationElliptic.centerX,rotationElliptic.centerY,rotationElliptic.radius)){
			isFinished=true;
		}
		else {
			colorPosition.x++;
		}
	}
	basicRosette(inputImagePosition,rotationElliptic.nCenter);
	inputImagePosition.scale(rotationElliptic.scale);
	return true;
}