"use strict";

/*
making the sums
but first prepare and organize the data

fastFunction has the periodic sinLike and cosLike functions for the waves
*/
function SumWaves(fastFunction){
	this.p=0;
    this.fastFunction=fastFunction;
	this.evenOddSign=1;
    this.isOdd=false;
    // the combination method
    this.combination=SumWaves.sum;
	// the unit vectors
	this.ex=[];
	this.ey=[];
	// position times unit vectors
	this.xTimesE=[];
    // phases for 3 and 4 color symmetry
    this.nColorSym=1;
    // for even 2p rotational symmetry
    this.p2DivNOdd=false;
    // phases
    this.cos2PiHDivN=[];
    this.sin2PiHDivN=[];
    var Pi2DivN=0;
}

/*
setup:
int p is dimension of embedding space
int nColorSym is number for color symmetry (2,3, or 4)
*/
SumWaves.prototype.set=function(p,nColorSym){
    this.p=p;
    // the unit vectors
    this.ex.length=p;
    this.ey.length=p;
    // position times unit vectors
    this.xTimesE.length=p;
    // phases for 3 and 4 color symmetry
    this.nColorSym=nColorSym;
    // for even 2p rotational symmetry
    this.p2DivNOdd=(2*p/nColorSym)%2==1;
    // phases
    this.cos2PiHDivN.length=p;
    this.sin2PiHDivN.length=p;
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
    var result=this.combination.start;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        result=this.combination.combine(result, fastFunction.cosLike(k*xTimesE[i]));
    }
    return result;
}

// 2-color symmetry for 2p rotational symmetry
// using summation
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
    var result=this.combination.start;
    var xTimesE=this.xTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        result=this.combination.combine(result, fastFunction.sinLike(k*xTimesE[i]));
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
    var result=this.combination.start;
    var xTimesE=this.xTimesE;
    var lastXTimesE=this.evenOddSign*xTimesE[0];
    var newXTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        newXTimesE=xTimesE[i];
        result=this.combination.combine(result, fastFunction.cosLike(k1*lastXTimesE+k2*newXTimesE));
        lastXTimesE=newXTimesE;
    }
    return result;   
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
    var result=this.combination.start;
    var xTimesE=this.xTimesE;
    var lastXTimesE=this.evenOddSign*xTimesE[0];
    var newXTimesE;
    var fastFunction=this.fastFunction;
    for (var i=this.p-1;i>=0;i--){
        newXTimesE=xTimesE[i];
        result=this.combination.combine(result, fastFunction.sinLike(k1*lastXTimesE+k2*newXTimesE));
        lastXTimesE=newXTimesE;
    }
    return result;   
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


// different methods for combining

// symmetric, and continuous

// the standard sum
var makeSum=new Object();
makeSum.start=0;
makeSum.combine=function(result,term){
    return result+term;
}

// maximum of the waves
var makeMax=new Object();
makeMax.start=-100000;
makeMax.combine=function(result,term){
    return Math.max(result,term);
}

// the product
var makeProduct=new Object();
makeProduct.start=1;
makeProduct.combine=function(result,term){
    return result*term;
}

// the minimum of absolute values
var makeAbsoluteMinimum=new Object();
makeAbsoluteMinimum.start=10;
makeAbsoluteMinimum.combine=function(result,term){
    return Math.min(result,Math.abs(term));
}



// sum of absolute values
var makeAbsoluteSum=new Object();
makeAbsoluteSum.start=0;
makeAbsoluteSum.combine=function(result,term){
    return result+Math.abs(term)-0.636;
}

// discontinuous
// value of wave with smallest absolute value
var makeSignedMinimum=new Object();
makeSignedMinimum.start=10;
makeSignedMinimum.combine=function(result,term){
    return (Math.abs(result)>Math.abs(term))?term:result;
}