"use strict";

console.log(gamma);
console.log(alpha);
// separating the two mirrors
var quadTanGamma=Math.tan(0.5*Math.PI/nSymmCenter);

// mirror circles
var quadRadius=0.2;

var quadDistance=quadRadius*Math.cos(0.5*alpha)/Math.sin(0.5*gamma);
console.log(quadDistance);

var quadWorldRadius=Math.sqrt(quadDistance*quadDistance-quadRadius*quadRadius);

// rescale world radius to be 0.5
quadRadius*=0.5/quadWorldRadius;
quadDistance*=0.5/quadWorldRadius;

// center of second circle
var quadCenterX=quadDistance*Math.cos(gamma);
var quadCenterY=quadDistance*Math.sin(gamma);
console.log("cc "+quadCenterX+" "+quadCenterY);


// poincare disc
function quad(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=20;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		isFinished=true;
		inputImagePosition.y=1000000;
	}
	while (!isFinished){
		colorPosition.x*=inputImagePosition.reduceAngle(nSymmCenter);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
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
	inputImagePosition.reduceAngleSmooth(nSymmCenter);
	inputImagePosition.scale(scale);
}


// poincare disc
function quad2(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=20;		
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		isFinished=true;
		inputImagePosition.valid=false;
	}
	while (!isFinished){
		colorPosition.x*=inputImagePosition.reduceAngle(nSymmCenter);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.valid=false;
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
	inputImagePosition.reduceAngleSmooth(nSymmCenter);
	inputImagePosition.scale(scale);
}
