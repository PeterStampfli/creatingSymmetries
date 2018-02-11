"use strict";
// same as poincareDisc, but cutting corners
// beware: use (k 2 n) triangles

var cutCornersSymmetric={};

// parameters
cutCornersSymmetric.scale=20;

cutCornersSymmetric.setup=function(center,left,right){
	// rotational symmetry at center
	cutCornersSymmetric.nSymmCenter=center;
	//poincare circle and plane
	// rotational symmetry at left corner is always 2
	cutCornersSymmetric.nSymmLeft=left;
	// rotational symmetry at right corner
	cutCornersSymmetric.nSymmRight=right;

	// angles
	var alpha=Math.PI/cutCornersSymmetric.nSymmLeft;
	var beta=Math.PI/cutCornersSymmetric.nSymmRight;
	var gamma=Math.PI/cutCornersSymmetric.nSymmCenter;

	// poincare disc
	// intersection of straight lines with unit circle (radius=1)
	// find position of unit circle

	cutCornersSymmetric.yCenterCircle=Math.cos(alpha);
	cutCornersSymmetric.xCenterCircle=(Math.cos(alpha)*Math.cos(gamma)+Math.cos(beta))/Math.sin(gamma);

	var r2=cutCornersSymmetric.xCenterCircle*cutCornersSymmetric.xCenterCircle+cutCornersSymmetric.yCenterCircle*cutCornersSymmetric.yCenterCircle;
	var worldRadius=Math.sqrt(r2-1);
	// rescale world radius to be 0.5
	cutCornersSymmetric.rCircle=0.5/worldRadius;
	cutCornersSymmetric.yCenterCircle*=0.5/worldRadius;
	cutCornersSymmetric.xCenterCircle*=0.5/worldRadius;
	//world radius is now 0.5


console.log("xcc "+cutCornersSymmetric.xCenterCircle);
console.log("radiuscc "+cutCornersSymmetric.rCircle);
console.log("basic triangle border at x-axis "+(cutCornersSymmetric.xCenterCircle-cutCornersSymmetric.rCircle));
console.log(cutCornersDouble.yCenterCircle);


	// distance of center of basic mirror cutCornersDouble.xCenterCircle with radius cutCornersDouble.rCircle
	worldRadius=0.5;

	console.log("offset "+delta);
// a hack
var dBase=Math.sqrt(r2);
	var delta=dBase-cutCornersSymmetric.rCircle;
	var dAdd=(worldRadius*worldRadius+delta*delta)/2/delta/Math.cos(gamma/2);



	cutCornersSymmetric.xCenterAdd1=dAdd*Math.cos(gamma);
	cutCornersSymmetric.yCenterAdd1=dAdd*Math.sin(gamma);

	cutCornersSymmetric.xCenterAdd2=dAdd;
	cutCornersSymmetric.yCenterAdd2=0;
	cutCornersSymmetric.rAdd=Math.sqrt(dAdd*dAdd-worldRadius*worldRadius);

console.log(" rAdd "+cutCornersSymmetric.rAdd);
}


// poincare disc
// colorposition: 0 if no mapping, else parity
cutCornersSymmetric.map=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
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
		colorPosition.x+=inputImagePosition.rotationMirrorSymmetry(cutCornersSymmetric.nSymmCenter);
		iter++;
		if (iter>iterMax){
			return false;
		}
		if (inputImagePosition.circleInversionInsideOut(cutCornersSymmetric.xCenterCircle,cutCornersSymmetric.yCenterCircle,cutCornersSymmetric.rCircle)){
			isFinished=false;
			colorPosition.x++;
		}
		else { // basic mirroring finished, point is inside basic triangle, additional mirrors
			if (inputImagePosition.circleInversionInsideOut(cutCornersSymmetric.xCenterAdd1,cutCornersSymmetric.yCenterAdd1,cutCornersSymmetric.rAdd)){

				colorPosition.x++;
			}

			if (inputImagePosition.circleInversionInsideOut(cutCornersSymmetric.xCenterAdd2,cutCornersSymmetric.yCenterAdd2,cutCornersSymmetric.rAdd)){

				colorPosition.x++;
			}


		}
	}
	basicRosette(inputImagePosition,cutCornersSymmetric.nSymmCenter);
	inputImagePosition.scale(cutCornersSymmetric.scale);
	return true;
}
