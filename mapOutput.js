"use strict";

/*
output data of map, may be changed ....

(x,y) position where to get the input pixel

(u,v) position for choosing the color modification
*/
function MapOutput(){
	this.x=0;
	this.y=0;
	this.u=0;
	this.v=0;
}

/*
make average of two values
*/
MapOutput.prototype.average=function(one,two){
	this.x=0.5*(one.x+two.x);
	this.y=0.5*(one.y+two.y);
	this.u=0.5*(one.u+two.u);
	this.v=0.5*(one.v+two.v);
}