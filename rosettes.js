"use strict";

// basic rosettes for kaleidoscopes

var rosettePowerR=1;

var nCenter=3;


// rosette maps inputImagePosition only
var basicRosette;


function rosette(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	inputImagePosition.set(spacePosition);

	basicRosette(inputImagePosition,nCenter);

	return true;
}



// rotation and mirror symmetry, non-analytic function on phi
function rosettePeriodicMirrorPhi(position,n){
	var angle=position.angle();
	angle*=n*0.159154;                        // n/2pi

	angle=0.5*imageFastFunction.periodicMapping(angle);

	angle*=6.28318/n;
	position.setPolar(position.radius(),angle);

}

// simple analytic, with mirror symmetry
function rosetteRotationMirror(position,n){
	var angle=position.angle();
	var rPow=imageFastFunction.exp(rosettePowerR* imageFastFunction.log(position.radius()));
	position.x=rPow*imageFastFunction.cosLike(n*angle);
	position.y=rPow*imageFastFunction.cosLike(2*n*angle);
}

// simple analytic, with rotation symmetry only
function rosetteRotation(position,n){
	var angle=position.angle();
	var rPow=imageFastFunction.exp(rosettePowerR* imageFastFunction.log(position.radius()));
	position.setPolar(rPow,n*angle);
}