"use strict";

// parameters
var rotationEuklidScale=20;
// poincare circle: rotational symmetry at center
var rotationEuklidNCenter=4;
//poincare circle and plane


// normal unit vector for third line
var rotationEuklidNCenterNormalX,rotationEuklidNCenterNormalY;

var rotationEuklidBeta=0.5*Math.PI*(1-2/rotationEuklidNCenter);
console.log(rotationEuklidBeta);
rotationEuklidNCenterNormalX=-Math.sin(rotationEuklidBeta);
rotationEuklidNCenterNormalY=-Math.cos(rotationEuklidBeta);
console.log("euk "+rotationEuklidNCenterNormalX);
console.log("euk "+rotationEuklidNCenterNormalY);

// position of third line
var rotationEuklidLineX=0.2;


// standard kaleidoscope
function rotationEuklid(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	var isFinished=false;
	var iter=0;
	var iterMax=10;	
	var distance;                                            // distance to plane, normal pointing inside triangle	
	inputImagePosition.set(spacePosition);
	colorPosition.x=1;                                        // as parity for 2 colors
	while (!isFinished){
		inputImagePosition.rotationSymmetry(rotationEuklidNCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		else {
			distance=rotationEuklidNCenterNormalX*(inputImagePosition.x-rotationEuklidLineX)+rotationEuklidNCenterNormalY*inputImagePosition.y;
			if (distance>=-0.00001){
				isFinished=true;
			}
			else {
				inputImagePosition.x-=2*distance*rotationEuklidNCenterNormalX;
				inputImagePosition.y-=2*distance*rotationEuklidNCenterNormalY;
				colorPosition.x=-colorPosition.x;
			}
		}
	}
	basicRosette(inputImagePosition,rotationEuklidNCenter);
	inputImagePosition.scale(rotationEuklidScale);
	return true;
}
