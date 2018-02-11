"use strict";
// same as poincareDisc, but cutting corners
// beware: use (k 2 n) triangles

var cutCornersDouble={};

// parameters
cutCornersDouble.scale=20;

cutCornersDouble.setup=function(center,left,right){
	// rotational symmetry at center
	cutCornersDouble.nSymmCenter=center;
	//poincare circle and plane
	// rotational symmetry at left corner is always 2
	cutCornersDouble.nSymmLeft=2;
	// rotational symmetry at right corner
	cutCornersDouble.nSymmRight=right;

	// angles
	var alpha=Math.PI/cutCornersDouble.nSymmLeft;
	var beta=Math.PI/cutCornersDouble.nSymmRight;
	var gamma=Math.PI/cutCornersDouble.nSymmCenter;

	// poincare disc
	// intersection of straight lines with unit circle (radius=1)
	// find position of unit circle

	cutCornersDouble.yCenterCircle=Math.cos(alpha);
	cutCornersDouble.xCenterCircle=(Math.cos(alpha)*Math.cos(gamma)+Math.cos(beta))/Math.sin(gamma);

	var r2=cutCornersDouble.xCenterCircle*cutCornersDouble.xCenterCircle+cutCornersDouble.yCenterCircle*cutCornersDouble.yCenterCircle;
	var worldRadius=Math.sqrt(r2-1);
	// rescale world radius to be 0.5
	cutCornersDouble.rCircle=0.5/worldRadius;
	cutCornersDouble.yCenterCircle*=0.5/worldRadius;
	cutCornersDouble.xCenterCircle*=0.5/worldRadius;
	//world radius is now 0.5


console.log("xcc "+cutCornersDouble.xCenterCircle);
console.log("radiuscc "+cutCornersDouble.rCircle);
console.log("basic triangle border at x-axis "+(cutCornersDouble.xCenterCircle-cutCornersDouble.rCircle));
console.log(cutCornersDouble.yCenterCircle);


	// distance of center of basic mirror cutCornersDouble.xCenterCircle with radius cutCornersDouble.rCircle
	worldRadius=0.5;
	var delta=cutCornersDouble.xCenterCircle-cutCornersDouble.rCircle;
	console.log("offset "+delta);
// a hack
	var dAdd=cutCornersDouble.xCenterCircle;
	cutCornersDouble.xCenterAdd=dAdd*Math.cos(gamma);
	cutCornersDouble.yCenterAdd=dAdd*Math.sin(gamma);
	cutCornersDouble.rAdd=cutCornersDouble.rCircle;

console.log(" rAdd "+cutCornersDouble.rAdd);
}


// poincare disc
// colorposition: 0 if no mapping, else parity
cutCornersDouble.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
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
		colorPosition.x+=inputImagePosition.rotationMirrorSymmetry(cutCornersDouble.nSymmCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		if (inputImagePosition.circleInversionInsideOut(cutCornersDouble.xCenterCircle,cutCornersDouble.yCenterCircle,cutCornersDouble.rCircle)){
			isFinished=false;
			colorPosition.x++;
		}
		else { // basic mirroring finished, point is inside basic triangle, additional mirrors
			if (inputImagePosition.circleInversionInsideOut(cutCornersDouble.xCenterAdd,cutCornersDouble.yCenterAdd,cutCornersDouble.rAdd)){

				colorPosition.x++;
			}



		}
	}
	basicRosette(inputImagePosition,2*cutCornersDouble.nSymmCenter);
	inputImagePosition.scale(cutCornersDouble.scale);
	return true;
}
