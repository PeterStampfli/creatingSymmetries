"use strict";

var ellipticPolygon={};

// parameters
ellipticPolygon.scale=20;
ellipticPolygon.baseLength=0.3;

ellipticPolygon.setup=function(center,theLeft,right){
	// rotational symmetry at center
	ellipticPolygon.nSymmCenter=center;


	// rotational symmetry at left corner (and right corner)
	ellipticPolygon.nSymmLeft=theLeft;


	// angles
	var alpha=Math.PI/ellipticPolygon.nSymmLeft;


	ellipticPolygon.theGamma=Math.PI/ellipticPolygon.nSymmCenter;

	ellipticPolygon.circleRadius=ellipticPolygon.baseLength*Math.sin(ellipticPolygon.theGamma)/Math.sin(0.5*alpha);
	
}


// colorposition: 0 if no mapping, else parity

ellipticPolygon.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=iterMaximum;	
	var circleAngle=0;	
	inputImagePosition.set(spacePosition);
	colorPosition.x=0;                                        // as parity for 2 colors
	while (!isFinished){
		isFinished=true;
		iter++;
		if (iter>iterMax){
			return false;
		}
		// find the center angle of the point
		circleAngle=Math.floor(elementaryFastFunction.atan2(inputImagePosition.y,inputImagePosition.x)*0.5/ellipticPolygon.theGamma);
		circleAngle=ellipticPolygon.theGamma*(2*circleAngle+1);

		
		if (inputImagePosition.circleInversionOutsideIn(-ellipticPolygon.baseLength*elementaryFastFunction.cos(circleAngle),
									-ellipticPolygon.baseLength*elementaryFastFunction.sin(circleAngle),
									ellipticPolygon.circleRadius)){
			isFinished=false;
			colorPosition.x++;
		}
	}
	inputImagePosition.scale(ellipticPolygon.scale);
	return true;
}
