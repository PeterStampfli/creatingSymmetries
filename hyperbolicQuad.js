"use strict";



// parameters
var quadScale=20;

//  rotational symmetry at center
var quadNCenter=6;
// rotational symmetry at left corner
var quadNLeft=3;
// rotational symmetry at right corner
var quadNRight=4;

// cutoff around disc
var quadCutoff=false;

// angles
var quadAlpha=Math.PI/quadNLeft;
var quadBeta=Math.PI/quadNRight;
var quadGamma=Math.PI/quadNCenter;

// separating the two mirrors
var quadTanGamma=Math.tan(0.5*Math.PI/quadNCenter);

// mirror circles
var quadRadius=0.2;

var quadDistance=quadRadius*Math.cos(0.5*quadAlpha)/Math.sin(0.5*quadGamma);
console.log(quadDistance);

var quadWorldRadius=Math.sqrt(quadDistance*quadDistance-quadRadius*quadRadius);

// rescale world radius to be 0.5
quadRadius*=0.5/quadWorldRadius;
quadDistance*=0.5/quadWorldRadius;

// center of second circle
var quadCenterX=quadDistance*Math.cos(quadGamma);
var quadCenterY=quadDistance*Math.sin(quadGamma);
console.log("cc "+quadCenterX+" "+quadCenterY);


// poincare disc
function quad(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=20;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&quadCutoff){
		return false;
	}
	while (!isFinished){
		colorPosition.x*=inputImagePosition.rotationMirrorSymmetry(quadNCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		// two different mirrors
		if (inputImagePosition.y>quadTanGamma*inputImagePosition.x){
			isFinished=!inputImagePosition.circleInversionInsideOut(quadCenterX,quadCenterY,quadRadius);
		}
		else {
			isFinished=!inputImagePosition.circleInversionInsideOut(quadDistance,0,quadRadius);
		}
		if (!isFinished) {
			colorPosition.x=-colorPosition.x;
		}
		isFinished=true;
	}
	inputImagePosition.rotationMirrorSmooth(quadNCenter);
	inputImagePosition.scale(quadScale);
	return true;
}



function quad2(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=20;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&quadCutoff){
		return false;
	}
	while (!isFinished){
		colorPosition.x*=inputImagePosition.rotationMirrorSymmetry(quadNCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		// two different mirrors, is finished=true means there is no inversion
			isFinished=!inputImagePosition.circleInversionInsideOut(quadCenterX,quadCenterY,quadRadius);
		if (isFinished) {   // first circle did not invert, try next
			isFinished=!inputImagePosition.circleInversionInsideOut(quadDistance,0,quadRadius);
		}
		if (!isFinished) {
			colorPosition.x=-colorPosition.x;
		}
		isFinished=true;
	}
	inputImagePosition.rotationMirrorSmooth(quadNCenter);
	inputImagePosition.scale(quadScale);
	return true;
}
