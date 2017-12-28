"use strict";

var rotationEuklid={};
// parameters
rotationEuklid.scale=20;

rotationEuklid.setup=function(center,left,right){
	// rotational symmetry at center, only relevant parameter
	rotationEuklid.nCenter=center;


	// normal unit vector for third line

	var beta=0.5*Math.PI*(1-2/rotationEuklid.nCenter);
	rotationEuklid.normalX=-Math.sin(beta);
	rotationEuklid.normalY=-Math.cos(beta);

	// position of third line
	rotationEuklid.lineX=0.2;
}

// standard kaleidoscope
function rotationEuklidMap(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;	
	var distance;                                            // distance to plane, normal pointing inside triangle	
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	while (!isFinished){
		colorPosition.x+=inputImagePosition.rotationSymmetry(rotationEuklid.nCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else {
			distance=rotationEuklid.normalX*(inputImagePosition.x-rotationEuklid.lineX)+rotationEuklid.normalY*inputImagePosition.y;
			if (distance>=-0.00001){
				isFinished=true;
			}
			else {
				inputImagePosition.x-=2*distance*rotationEuklid.normalX;
				inputImagePosition.y-=2*distance*rotationEuklid.normalY;
				colorPosition.x++;
			}
		}
	}
	basicRosette(inputImagePosition,rotationEuklid.nCenter);
	inputImagePosition.scale(rotationEuklid.scale);
	return true;
}
