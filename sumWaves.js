"use strict";

/*
making the sums
but first prepare and organize the data

int p is dimension of embedding space
fastFunction has the periodic sinLike and cosLike functions for the waves
*/
function SumWaves(p,fastFunction){
	this.p=p;
    this.fastFunction=fastFunction;
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

/*
making the sums: initialize with oddRotationalSymmetry or evenRotationalSymmetry
*/

/*
only one wavevector component, is the same for even and odd rotational symmetry
*/
SumWaves.prototype.cosines1=function(k){
    var sum=0;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        sum+=fastFunction.cosLike(k*xTimesE[i]);
    }
    return sum;
}

// 2-color symmetry for 2p rotational symmetry
SumWaves.prototype.alternatingCosines1=function(k){
    var sum=0;
    var factor=1;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        sum+=factor*fastFunction.cosLike(k*xTimesE[i]);
        factor=-factor;
    }
    return sum;
}

SumWaves.prototype.sines1=function(k){
    var sum=0;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        sum+=fastFunction.sinLike(k*xTimesE[i]);
    }
    return sum;
}

// for 2-color symmetry (p-rotational symmetry with odd p)
SumWaves.prototype.alternatingSines1=function(k){
    var sum=0;
    var factor=1;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        sum+=factor*fastFunction.sinLike(k*xTimesE[i]);
        factor=-factor;
    }
    return sum;
}

/*
two wavevector components: with initialized wraparound sign
*/
SumWaves.prototype.cosines2=function(k1,k2){
    var sum=0;
    var xTimesE=this.xTimesE;
    var lastXTimesE=this.evenOddSign*xTimesE[0];
    var newXTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        newXTimesE=xTimesE[i];
        sum+=fastFunction.cosLike(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;   
}

// 2-color symmetry for 2p rotational symmetry 
SumWaves.prototype.alternatingCosines2=function(k1,k2){
    var sum=0;
    var factor=1;
    var xTimesE=this.xTimesE;
    var lastXTimesE=this.evenOddSign*xTimesE[0];
    var newXTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        newXTimesE=xTimesE[i];
        sum+=factor*fastFunction.cosLike(k1*lastXTimesE+k2*newXTimesE);
        factor=-factor;
        lastXTimesE=newXTimesE;
    }
    return sum;   
}

SumWaves.prototype.sines2=function(k1,k2){
    var sum=0;
    var xTimesE=this.xTimesE;
    var lastXTimesE=this.evenOddSign*xTimesE[0];
    var newXTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        newXTimesE=xTimesE[i];
        sum+=fastFunction.sinLike(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;   
}

// 2-color symmetry for p rotational symmetry with odd p
SumWaves.prototype.alternatingSines2=function(k1,k2){
    var sum=0;
    var factor=1;
    var xTimesE=this.xTimesE;
    var lastXTimesE=this.evenOddSign*xTimesE[0];
    var newXTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        newXTimesE=xTimesE[i];
        sum+=factor*fastFunction.sinLike(k1*lastXTimesE+k2*newXTimesE);
        factor=-factor;
        lastXTimesE=newXTimesE;
    }
    return sum;   
}