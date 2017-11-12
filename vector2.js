"use strict";

// vector object for positions, for java use libgdx Vector2

function Vector2(){
	this.x=0;
	this.y=0;
}

/*
set vector based on component values
*/
Vector2.prototype.setComponents=function(x,y){
	this.x=x;
	this.y=y;
	return this;
}

/*
set vector based on another vector
*/
Vector2.prototype.set=function(v){
	this.x=v.x;
	this.y=v.y;
	return this;
}

/*
scale the vector
*/
Vector2.prototype.scale=function(factor){
	this.x*=factor;
	this.y*=factor;
}

/*
set a vector to average of 2 other vectors
use for image smoothing
return the vector
*/
Vector2.prototype.average=function(one,two){
	this.x=0.5*(one.x+two.x);
	this.y=0.5*(one.y+two.y);
	this.x=two.x;
	this.y=two.y;
	return this;
}

/*
symmetries
*/

/*
periodic length 1 in x-direction, basic zone is 0...1
*/
Vector2.prototype.periodXUnit=function(){
	this.x=this.x-Math.floor(this.x);
}

/*
periodic length 1 in x-direction, basic zone is 0...1
*/
Vector2.prototype.periodYUnit=function(){
	this.y=this.y-Math.floor(this.y);
}

/*
mirror from left to right if point is at right
*/
Vector2.prototype.leftToRightAt=function(x){
	if (this.x>x){
		this.x=x+x-this.x;
	}
}

/*
mirror from top to bottom if point is above
Attention: inverted y-axis
*/
Vector2.prototype.bottomToTopAt=function(y){
	if (this.y>y){
		this.y=y+y-this.y;
	}
}

/*
mirror at up going diagonal x=y if point is too high
Attention: inverted y-axis
*/
Vector2.prototype.upperLeftToLowerRightAt=function(centerX,centerY){
	var dx=this.x-centerX;
	var dy=this.y-centerY;
	if (dy>dx){
		this.x=centerX+dy;
		this.y=centerY+dx;
	}	
}

/*
inversion at a circle
change vector only if point is inside the circle, 
return true if inversion , false if point is outside
*/
Vector2.prototype.circleInversion=function(centerX,centerY,radius){
	var dx=this.x-centerX;
	var dy=this.y-centerY;
	var pointR2=dx*dx+dy*dy;
	var circleR2=radius*radius;
	var factor;
	if (pointR2+0.0001>=circleR2){
		return false;
	}
	else {
		factor=circleR2/pointR2;
		this.x=centerX+dx*factor;
		this.y=centerY+dy*factor;
		return true;
	}
}

/*
check if a point is at left of a given line, looking from a to b
attention: inverted y-axis mirrors, left appears to be right
*/
Vector2.prototype.isAtLeftOfLine=function(ax,ay,bx,by){
		return (bx-ax)*(this.y-ay)-(by-ay)*(this.x-ax)>0;	
}

/*
check if point is inside a convex polygon
points as pair of coordinates
counterclockwise
attention: inverted y-axis mirrors, left appears to be right
argument is an array of coordinates, an arguments object with coordinates
 or a list of coordinate values
*/
Vector2.prototype.isInsidePolygon=function(coordinates){
	if (arguments.length>1){
		return this.isInsidePolygon(arguments);
	}
	else {
		var length=coordinates.length;
		var lengthM3=length-3;
		for (var i=0;i<lengthM3;i+=2){
			if (!this.isAtLeftOfLine(coordinates[i],coordinates[i+1],coordinates[i+2],coordinates[i+3])){
				return false;
			}
		}
		if (!this.isAtLeftOfLine(coordinates[length-2],coordinates[length-1],coordinates[0],coordinates[1])){
			return false;
		}
		return true;
	}
}

// reducing the angle

Vector2.prototype.angle=function(){
	return elementaryFastFunction.atan2(this.y,this.x);
}

Vector2.prototype.radius=function(){
	return Math.sqrt(this.x*this.x+this.y*this.y);
}

Vector2.prototype.radius2=function(){
	return this.x*this.x+this.y*this.y;
}

Vector2.prototype.setPolar=function(r,angle){
	this.x=r*elementaryFastFunction.cos(angle);
	this.y=r*elementaryFastFunction.sin(angle);
}

// make angle periodic, as in a polygon with nCorners
//  returns -1 if odd number of mirror reflections, 1 if even number
Vector2.prototype.reduceAngle=function(nCorners){
	var angle=this.angle();
	var parity=1;
	angle*=nCorners*0.159154;                        // n/2pi
	angle=angle-Math.floor(angle);
	if (angle>0.5){
		angle=1-angle;
		parity=-1;
	}
	angle*=6.28318/nCorners;
	this.setPolar(this.radius(),angle);
	return parity;
}


Vector2.prototype.reduceAngleSmooth=function(nCorners){
	var angle=this.angle();
	angle*=nCorners*0.159154;                        // n/2pi

	angle=0.5*imageFastFunction.periodicMapping(angle);

	angle*=6.28318/nCorners;
	this.setPolar(this.radius(),angle);
}