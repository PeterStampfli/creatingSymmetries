"use strict";

/*
making the sums
but first prepare and organize the data

int p is dimension of embedding space
int nColorSym is number for color symmetry (2,3, or 4)
fastFunction has the periodic sinLike and cosLike functions for the waves
*/
function SumWaves(p,nColorSym,fastFunction){
	this.p=p;
    this.fastFunction=fastFunction;
	this.evenOddSign=1;
    this.isOdd=false;
	// the unit vectors
	this.ex=new Array(p);
	this.ey=new Array(p);
	// position times unit vectors
	this.xTimesE=new Array(p);
    // phases for 3 and 4 color symmetry
    this.nColorSym=nColorSym;
    // for even 2p rotational symmetry
    this.p2DivNOdd=(2*p/nColorSym)%2==1;
    // phases
    this.cos2PiHDivN=new Array(p);
    this.sin2PiHDivN=new Array(p);
    var Pi2DivN=2*Math.PI/nColorSym;
    for (var h=0;h<p;h++){
        this.cos2PiHDivN[h]=Math.cos(Pi2DivN*h);
        this.sin2PiHDivN[h]=Math.sin(Pi2DivN*h);
    }
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
create the unit vectors for odd number rotational symmetry (odd p)
*/
SumWaves.prototype.oddRotationalSymmetry=function(){
    this.unitVectors(2*Math.PI/this.p);
    this.evenOddSign=1;
    this.isOdd=true;
}

/*
create the unit vectors for even number rotational symmetry 
(even or odd p, rotational symmetry =2p)
*/
SumWaves.prototype.evenRotationalSymmetry=function(){
    this.unitVectors(Math.PI/this.p);
    this.evenOddSign=-1;
    this.isOdd=false;
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
// sum
SumWaves.prototype.cosines1=function(k){
    var sum=0;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        sum+=fastFunction.cosLike(k*xTimesE[i]);
    }
    return sum;
}

// minimum
SumWaves.prototype.minimumCosines1=function(k){
    var result=1000;
    var term;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        term=fastFunction.cosLike(k*xTimesE[i]);
        if (Math.abs(term)<Math.abs(result)){
            result=term;
        }
    }
    return result;
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

// minimum
SumWaves.prototype.minimumSines1=function(k){
    var result=1000;
    var term;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        term=fastFunction.sinLike(k*xTimesE[i]);
        if (Math.abs(term)<Math.abs(result)){
            result=term;
        }
    }
    return result;
}

// for 2-color symmetry (2p-rotational symmetry with odd p)
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

// 2-color symmetry for 2p rotational symmetry with odd p
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

// color sums: 3 and 4 colors
// with the two components

SumWaves.prototype.colorSum1X=function(k){
    var sum=0;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    var cos2PiHDivN=this.cos2PiHDivN;
    var sin2PiHDivN=this.sin2PiHDivN;
    if (this.isOdd){
        var deltaPhase=2*Math.PI/this.nColorSym;
        var phase=0;
        for (var i=0;i<p;i++){
            sum+=fastFunction.cosLike(phase+k*xTimesE[i]);
            phase+=deltaPhase;
        }
    }
    else if (this.p2DivNOdd){
        for (var i=0;i<p;i++){
            sum+=-sin2PiHDivN[i]*fastFunction.sinLike(k*xTimesE[i]);
        }
    }
    else {
        for (var i=0;i<p;i++){
            sum+=cos2PiHDivN[i]*fastFunction.cosLike(k*xTimesE[i]);
        }
    }
    return sum;
}

SumWaves.prototype.colorSum1Y=function(k){
    var sum=0;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    if (this.isOdd){
        var deltaPhase=2*Math.PI/this.nColorSym;
        var phase=0;
        for (var i=0;i<p;i++){
            sum+=fastFunction.sinLike(phase+k*xTimesE[i]);
            phase+=deltaPhase;
        }
    }
    else if (this.p2DivNOdd){
        var cos2PiHDivN=this.cos2PiHDivN;
        for (var i=0;i<p;i++){
            sum+=cos2PiHDivN[i]*fastFunction.sinLike(k*xTimesE[i]);
        }
    }
    else {
        var sin2PiHDivN=this.sin2PiHDivN;
        for (var i=0;i<p;i++){
            sum+=sin2PiHDivN[i]*fastFunction.cosLike(k*xTimesE[i]);
        }
    }
    return sum;
}