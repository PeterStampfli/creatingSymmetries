"use strict";

var euclid={};
// parameters
euclid.scale=20;
// position of third line
euclid.lineX=0.2

euclid.setup=function(center,left,right){
	euclid.nCenter=center;
	//poincare circle and plane
	// rotational symmetry at left corner
	euclid.nLeft=left;
	// rotational symmetry at right corner
	euclid.nRight=right;
	euclid.alpha=Math.PI/euclid.nLeft;
	// normal unit vector for third line
	euclid.normalX=-Math.sin(euclid.alpha);
	euclid.normalY=-Math.cos(euclid.alpha);
}

// standard kaleidoscope
euclid.map=function (inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;	
	var distance;                                            // distance to plane, normal pointing inside triangle	
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	while (!isFinished){
		colorPosition.x+=inputImagePosition.rotationMirrorSymmetry(euclid.nCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else {
			distance=euclid.normalX*(inputImagePosition.x-euclid.lineX)+euclid.normalY*inputImagePosition.y;
			if (distance>=-0.00001){
				isFinished=true;
			}
			else {
				inputImagePosition.x-=2*distance*euclid.normalX;
				inputImagePosition.y-=2*distance*euclid.normalY;
				colorPosition.x++;
			}
		}
	}
	inputImagePosition.rotationMirrorSmooth(euclid.nCenter);
	inputImagePosition.scale(euclid.scale);
	return true;
}
