"use strict";

// transform any object with x any fields

/*
create the object with a fastFunction
has elementary sin and cos functions
*/
function Transform(fastFunction){
	this.fastFunction=fastFunction;
	this.shiftX=0;
	this.shiftY=0;
	this.angle=0;
	this.scale=1;
	this.scaleCosAngle=1;
	this.scaleSinAngle=0;
}

/*
set the shift
*/
Transform.prototype.setShift=function(x,y){
	this.shiftX=x;
	this.shiftY=y;
}

/*
adjust the shift
*/
Transform.prototype.addShift=function(x,y){
	this.shiftX+=x;
	this.shiftY+=y;
}

/*
scale the shift
*/
Transform.prototype.scaleShift=function(factor){
	this.shiftX*=factor;
	this.shiftY*=factor;
}

/*
set the combined factors from scale and angle
*/
Transform.prototype.combineScaleRotation=function(){
	this.scaleCosAngle=this.scale*this.fastFunction.cosLike(this.angle);
	this.scaleCosAngle=this.scale*this.fastFunction.sinLike(this.angle);
}

/*
set the scale (and the combined factors)
*/
Transform.prototype.setScale=function(scale){
	this.scale=scale;
	this.combineScaleRotation();
}

/*
set the angle (and combined factors)
*/
Transform.prototype.setAngle=function(angle){
	this.angle=angle;
	this.combineScaleRotation();
}

/*
shift and then scale only
*/
Transform.prototype.shiftScale=function(position){
	position.x=this.scale*(position.x+this.shiftX);
	position.y=this.scale*(position.y+this.shiftY);
}

/*
change position: first rotate and scale, then shift
*/
Transform.prototype.scaleRotateShift=function(position){
	var h=this.scaleCosAngle*position.x-this.scaleSinAngle*position.y+this.shiftX;
	position.y=this.scaleSinAngle*position.x+this.scaleCosAngle*position.y+this.shiftY;
	position.x=h;
}

/*
changed coordinate x-component: first rotate and scale, then shift
*/
Transform.prototype.scaleRotateShiftX=function(position){
	return this.scaleCosAngle*position.x-this.scaleSinAngle*position.y+this.shiftX;
}

/*
changed coordinate y-component: first rotate and scale, then shift
*/
Transform.prototype.scaleRotateShiftY=function(position){
	return this.scaleSinAngle*position.x+this.scaleCosAngle*position.y+this.shiftY;
}