"use strict";

/*
making the sums
but first prepare and organize the data

int p is dimension of embedding space
*/
function SumWaves(p){
	this.p=p;
	this.evenOddSign=1;
	// the unit vectors
	this.ex=new Array(p);
	this.ey=new Array(p);
	// position times unit vectors
	this.xTimesE=new Array(p);
}

/*
create the unit vectors depending on the angle between them
will be done only once, no need for fast function
*/
SumWaves.prototype.unitVectors=function(deltaAngle){
	var angle=0;
    for (var i=0;i<this.p;i++){
        this.ex[i]=Math.sin(angle);
        this.ey[i]=Math.cos(angle);
        angle+=deltaAngle;
    }
}

/*
create the unit vectors for odd number rotational symmetry
*/
SumWaves.prototype.oddRotationalSymmetry=function(){
    this.unitVectors(2*Math.PI/this.p);
    this.evenOddSign=1;
}

/*
create the unit vectors for even number rotational symmetry
*/
SumWaves.prototype.evenRotationalSymmetry=function(){
    this.unitVectors(Math.PI/this.p);
    this.evenOddSign=-1;
}

/*
calculate scalar product between position (x,y) and unit vectors
*/
SumWaves.prototype.positionTimesUnitVectors= function (x,y){
    for (var i=this.p-1;i>=0;i--){
        this.xTimesE[i]=x*this.ex[i]+y*this.ey[i];
    }
}