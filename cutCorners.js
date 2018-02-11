"use strict";
// same as poincareDisc, but cutting corners
// beware: use (k 2 n) triangles

var cutCorners={};

// parameters
cutCorners.scale=20;

cutCorners.setup=function(center,left,right){
	// rotational symmetry at center
	cutCorners.nSymmCenter=center;
	//poincare circle and plane
	// rotational symmetry at left corner is always 2
	cutCorners.nSymmLeft=2;
	// rotational symmetry at right corner
	cutCorners.nSymmRight=right;

	// angles
	var alpha=Math.PI/cutCorners.nSymmLeft;
	var beta=Math.PI/cutCorners.nSymmRight;
	var gamma=Math.PI/cutCorners.nSymmCenter;

	// poincare disc
	// intersection of straight lines with unit circle (radius=1)
	// find position of unit circle

	cutCorners.yCenterCircle=Math.cos(alpha);
	cutCorners.xCenterCircle=(Math.cos(alpha)*Math.cos(gamma)+Math.cos(beta))/Math.sin(gamma);

	var r2=cutCorners.xCenterCircle*cutCorners.xCenterCircle+cutCorners.yCenterCircle*cutCorners.yCenterCircle;
	var worldRadius=Math.sqrt(r2-1);
	// rescale world radius to be 0.5
	cutCorners.rCircle=0.5/worldRadius;
	cutCorners.yCenterCircle*=0.5/worldRadius;
	cutCorners.xCenterCircle*=0.5/worldRadius;
	//world radius is now 0.5


console.log("xcc "+cutCorners.xCenterCircle);
console.log("radiuscc "+cutCorners.rCircle);
console.log("basic triangle border at x-axis "+(cutCorners.xCenterCircle-cutCorners.rCircle));
console.log(cutCorners.yCenterCircle);


	// distance of center of basic mirror cutCorners.xCenterCircle with radius cutCorners.rCircle
	worldRadius=0.5;
	var delta=cutCorners.xCenterCircle-cutCorners.rCircle;
	console.log("offset "+delta);
	var dAdd=(worldRadius*worldRadius+delta*delta)/2/delta/Math.cos(gamma);
	cutCorners.xCenterAdd=dAdd*Math.cos(gamma);
	cutCorners.yCenterAdd=dAdd*Math.sin(gamma);
	cutCorners.rAdd=Math.sqrt(dAdd*dAdd-worldRadius*worldRadius);

console.log(" rAdd "+cutCorners.rAdd);
}


// poincare disc
// colorposition: 0 if no mapping, else parity
cutCorners.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
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
		colorPosition.x+=inputImagePosition.rotationMirrorSymmetry(cutCorners.nSymmCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		if (inputImagePosition.circleInversionInsideOut(cutCorners.xCenterCircle,cutCorners.yCenterCircle,cutCorners.rCircle)){
			isFinished=false;
			colorPosition.x++;
		}
		else { // basic mirroring finished, point is inside basic triangle, additional mirrors
			if (inputImagePosition.circleInversionInsideOut(cutCorners.xCenterAdd,cutCorners.yCenterAdd,cutCorners.rAdd)){

				colorPosition.x++;
			}



		}
	}
	basicRosette(inputImagePosition,cutCorners.nSymmCenter);
	inputImagePosition.scale(cutCorners.scale);
	return true;
}
