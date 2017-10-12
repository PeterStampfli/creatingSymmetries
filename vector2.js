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
}

/*
set vector based on another vector
*/
Vector2.prototype.set=function(v){
	this.x=v.x;
	this.y=v.y;
}