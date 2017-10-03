"use strict";


/*
input data for the map transform, may be changed

position in geometrical space
	x
	y

relative position on the canvas, size independent coordinates, going from 0 to 1
	canvasX
	canvasY
*/

function MapInput(){
	this.x=0;
	this.y=0;
	this.canvasX=0;
	this.canvasY=0;
}