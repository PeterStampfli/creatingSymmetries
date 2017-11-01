"use strict";

// polygons: is a point inside ???

/* 
create empty polygon, or polygon with given corners as list or array of coordinates
*/
function Polygon(){
	this.coordinates=[];
	this.clear();
	if (arguments.length==1){
		this.set(arguments[0]);
	}
	else if (arguments.length>1){
		this.set(arguments);
	}
}

/*
clear the polygon (for reuse)
*/
Polygon.prototype.clear=function(){
	this.coordinates.length=0;
	this.xMin=1000000;
	this.xMax=-1000000;
	this.yMin=1000000;
	this.yMax=-1000000;
}

/*
add a corner : update coordinates and limits
*/
Polygon.prototype.addCorner=function(x,y){
	this.coordinates.push(x,y);
	this.xMin=Math.min(this.xMin,x);
	this.xMax=Math.max(this.xMax,x);
	this.yMin=Math.min(this.yMin,y);
	this.yMax=Math.max(this.yMax,y);
}

/*
add many corners: as a list of pairs of coordinates or a float array
*/
Polygon.prototype.addCorners=function(coordinates){
	console.log(arguments);
	if (arguments.length>1){                               // catch calls with a list of coordinates as arguments
		this.addCorners(arguments);
	}
	var length=coordinates.length;
	for (var i=0;i<length;i+=2){
		this.addCorner(coordinates[i],coordinates[i+1]);
	}
}

/*
(re)set polygon
*/
Polygon.prototype.set=function(coordinates){
	this.clear();
	this.addCorners(coordinates);
}

/*
check if a vector is inside the polygon
*/
Polygon.prototype.contains=function(vector){
	var coordinates=this.coordinates;
	var length=coordinates.length;
	var lengthM3=length-3;

	for (var i=0;i<lengthM3;i+=2){

		if (!vector.isAtLeftOfLine(coordinates[i],coordinates[i+1],coordinates[i+2],coordinates[i+3])){
			return false;
		}
	}
	if (!this.isAtLeftOfLine(coordinates[length-2],coordinates[length-1],coordinates[0],coordinates[1])){
		return false;
	}
	return true;



}