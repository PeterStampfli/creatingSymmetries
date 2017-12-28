"use strict";

var elliptic={};

elliptic.scale=100;

elliptic.setup=function(center,left,right){
	//  rotational symmetry at center
	elliptic.nCenter=center;
	// rotational symmetry at left corner
	elliptic.nRight=right;
	// rotational symmetry at right corner
	elliptic.nLeft=left;

	// angles
	var alpha=Math.PI/elliptic.nLeft;
	var beta=Math.PI/elliptic.nRight;
	var gamma=Math.PI/elliptic.nCenter;

	// intersection of straight lines with unit circle (radius=1)
	// find position of unit circle
	// inverted for elliptic case

	elliptic.yCenter=-Math.cos(alpha);
	elliptic.xCenter=-(Math.cos(alpha)*Math.cos(gamma)+Math.cos(beta))/Math.sin(gamma);

	// rescale to circle radius
	elliptic.rCircle=0.3;
	elliptic.xCenter*=elliptic.rCircle;
	elliptic.yCenter*=elliptic.rCircle;
}

// elliptic kaleidoscope
elliptic.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	while (!isFinished){
		isFinished=true;
		colorPosition.x+=inputImagePosition.rotationMirrorSymmetry(elliptic.nCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		if (inputImagePosition.circleInversionOutsideIn(elliptic.xCenter,elliptic.yCenter,elliptic.rCircle)){
			isFinished=false;
			colorPosition.x++;
		}
	}
	basicRosette(inputImagePosition,elliptic.nCenter);
	inputImagePosition.scale(elliptic.scale);
	return true;
}