"use strict";

// rotate vector2 objects with prepared coefficients

function RotateVector2(angle){
	this.cosAngle=1;
	this.sinAngle=0;
}


// set the coefficients
RotateVector2.prototype.setAngle=function(angle){
	this.cosAngle=elementaryFastFunction.cos(angle);
	this.sinAngle=elementaryFastFunction.sin(angle);
}

// rotate around a given center
RotateVector2.prototype.rotate=function(centerX,centerY,vector){
	var dx=this.x-centerX;
	var dy=this.y-centerY;
	this.x=centerX+this.cosAngle*dx-This.sinAngle*dy;	
	this.y=centerY+sinAngle*dx+cosAngle*dy;
}

// mirror and rotate
//  mirrors at x-axis through center