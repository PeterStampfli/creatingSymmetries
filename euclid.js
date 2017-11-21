"use strict";

// normal unit vector for third line
var normalX,normalY;
normalX=-Math.sin(alpha);
normalY=-Math.cos(alpha);

// position of third line
var lineX=0.2;




// poincare disc
function euclid(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;	
	var distance;                                            // distance to plane, normal pointing inside triangle	
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	while (!isFinished){
		colorPosition.x*=inputImagePosition.reduceAngle(nSymmCenter);
		iter++;
		if (iter>iterMax){
			isFinished=true;
			inputImagePosition.y=1000000;
		}
		else {
			distance=normalX*(inputImagePosition.x-lineX)+normalY*inputImagePosition.y;
			if (distance>=-0.00001){
				isFinished=true;
			}
			else {
				inputImagePosition.x-=2*distance*normalX;
				inputImagePosition.y-=2*distance*normalY;
				colorPosition.x=-colorPosition.x;
			}
		}
	}
	inputImagePosition.reduceAngleSmooth(nSymmCenter);
	inputImagePosition.scale(scale);
}
