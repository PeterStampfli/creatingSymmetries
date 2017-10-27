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
mirror from left to right if point is at right
*/
Vector2.prototype.leftToRightAt=function(x){
	if (this.x>x){
		this.x=x+x-this.x;
	}
}