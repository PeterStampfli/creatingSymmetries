"use strict";


/*
input data for the map transform, may be changed

position in geometrical space
	spaceX
	spaceY

relative position on the image, size independent coordinates, going from 0 to 1
	imageX
	imageY
*/

function MapInput(){
	this.spaceX=0;
	this.spaceY=0;
	this.imageX=0;
	this.imageY=0;
}