"use strict";

var hyperbolicPolygon={};

// parameters
hyperbolicPolygon.scale=20;

hyperbolicPolygon.setup=function(center,theLeft,right){
	// rotational symmetry at center
	hyperbolicPolygon.nSymmCenter=center;

console.log(hyperbolicPolygon.nSymmCenter);
	// rotational symmetry at left corner (and right corner)
	hyperbolicPolygon.nSymmLeft=theLeft;
	
	// rotational symmetry
	hyperbolicPolygon.nRotation=right;


	// angles
	var alpha=Math.PI/hyperbolicPolygon.nSymmLeft;
	console.log(Math.PI);

	hyperbolicPolygon.theGamma=Math.PI/hyperbolicPolygon.nSymmCenter;
	console.log("gamme "+hyperbolicPolygon.theGamma);
	
	var trialRadius=Math.sin(hyperbolicPolygon.theGamma)/Math.cos(alpha/2);
	console.log("tr radius "+trialRadius);
	var worldRadius=Math.sqrt(1-trialRadius*trialRadius);
	
	hyperbolicPolygon.circleDistance=0.5/worldRadius;
	hyperbolicPolygon.circleRadius=trialRadius/2/worldRadius;

	console.log("rad "+hyperbolicPolygon.circleRadius);	
	console.log("dis "+hyperbolicPolygon.circleDistance);
}


// colorposition: 0 if no mapping, else parity

hyperbolicPolygon.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;	
	var circleAngle=0;	
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	if ((inputImagePosition.radius2()>0.25)&&cutoff){
		return false;
	}
	while (!isFinished){
		isFinished=true;
		iter++;
		if (iter>iterMax){
			return false;
		}
		// find the center angle of the point
		circleAngle=Math.floor(elementaryFastFunction.atan2(inputImagePosition.y,inputImagePosition.x)*0.5/hyperbolicPolygon.theGamma);
		circleAngle=hyperbolicPolygon.theGamma*(2*circleAngle+1);

		
		if (inputImagePosition.circleInversionInsideOut(hyperbolicPolygon.circleDistance*elementaryFastFunction.cos(circleAngle),
									hyperbolicPolygon.circleDistance*elementaryFastFunction.sin(circleAngle),
									hyperbolicPolygon.circleRadius)){
			isFinished=false;
			colorPosition.x++;
		}
	}
	if (hyperbolicPolygon.nRotation>0){
		basicRosette(inputImagePosition,hyperbolicPolygon.nRotation);
	}
	inputImagePosition.scale(hyperbolicPolygon.scale);
	return true;
}
