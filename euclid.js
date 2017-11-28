"use strict";

// parameters
var euclidScale=20;
// poincare circle: rotational symmetry at center
var euclidNCenter=6;
//poincare circle and plane
// rotational symmetry at left corner
var euclidNLeft=3;
// rotational symmetry at right corner
var euclidNRight=2;

var euclidAlpha=Math.PI/euclidNLeft;
// normal unit vector for third line
var normalX,normalY;
normalX=-Math.sin(euclidAlpha);
normalY=-Math.cos(euclidAlpha);

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
		colorPosition.x*=inputImagePosition.reduceAngle(euclidNCenter);
		iter++;
		if (iter>iterMax){
			return false;
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
	inputImagePosition.reduceAngleSmooth(euclidNCenter);
	inputImagePosition.scale(euclidScale);
	return true;
}
