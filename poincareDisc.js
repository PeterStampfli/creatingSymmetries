"use strict";

var poincareDisc={};

// parameters
poincareDisc.scale=20;

poincareDisc.setup=function(center,left,right){
	// rotational symmetry at center
	poincareDisc.nSymmCenter=center;
	//poincare circle and plane
	// rotational symmetry at left corner
	poincareDisc.nSymmLeft=left;
	// rotational symmetry at right corner
	poincareDisc.nSymmRight=right;

	// angles
	var alpha=Math.PI/poincareDisc.nSymmLeft;
	var beta=Math.PI/poincareDisc.nSymmRight;
	var gamma=Math.PI/poincareDisc.nSymmCenter;

	// poincare disc
	// intersection of straight lines with unit circle (radius=1)
	// find position of unit circle

	poincareDisc.yCenterCircle=Math.cos(alpha);
	poincareDisc.xCenterCircle=(Math.cos(alpha)*Math.cos(gamma)+Math.cos(beta))/Math.sin(gamma);
	var r2=poincareDisc.xCenterCircle*poincareDisc.xCenterCircle+poincareDisc.yCenterCircle*poincareDisc.yCenterCircle;
	var worldRadius=Math.sqrt(r2-1);
	// rescale world radius to be 0.5
	poincareDisc.rCircle=0.5/worldRadius;
	poincareDisc.yCenterCircle*=0.5/worldRadius;
	poincareDisc.xCenterCircle*=0.5/worldRadius;
}


// poincare disc
// colorposition: 0 if no mapping, else parity
poincareDisc.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		return false;
	}
	while (!isFinished){
		isFinished=true;
		colorPosition.x+=inputImagePosition.rotationMirrorSymmetry(poincareDisc.nSymmCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		if (inputImagePosition.circleInversionInsideOut(poincareDisc.xCenterCircle,poincareDisc.yCenterCircle,poincareDisc.rCircle)){
			isFinished=false;
			colorPosition.x++;
		}
	}
	basicRosette(inputImagePosition,poincareDisc.nSymmCenter);
	inputImagePosition.scale(poincareDisc.scale);
	return true;
}
