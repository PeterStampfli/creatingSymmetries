"use strict";

// for faster special cases

// only one wavevector component

// for image mapping (odd p and even 2p rotational symmetry)
function makeSumCosines(k){
    var sum=0;
    for (var i=0;i<p;i++){
        sum+=fCos(k*xTimesE[i]);
    }
    return sum;
}

// for image mapping (odd p rotational symmetry) 
// and 2-color symmetry (2p-rotational symmetry, odd p)
function makeSumSines(k){
    var sum=0;
     for (var i=0;i<p;i++){
        sum+=fSin(k*xTimesE[i]);
    }
    return sum;
}

//  image mapping: making sums for wavevectors with two neighboring non-zero coefficients

//  for odd-p rotational symmetry
function makeSumCosinesOdd2(k1,k2){
    var sum=0;
    var lastXTimesE=xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

function makeSumSinesOdd2(k1,k2){
    var sum=0;
    var lastXTimesE=xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fSin(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

// for even 2p-rotational symmetry

function makeSumCosinesEven2(k1,k2){
    var sum=0;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
     for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}


//  color symmetries
// for 2-color symmetry (2p-rotational symmetry with even p)
function makeSumAlternatingCosines(k){
    var sum=0;
    var factor=1;
     for (var i=0;i<p;i++){
        sum+=factor*fCos(k*xTimesE[i]);
        factor=-factor;
    }
    return sum;
}

// for color symmetry with odd-p rotational symmetry
// calculate basic w-wave
function colorsumOdd(k){
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    var sumKXE;
    sumReColor=0;
    sumImColor=0;
    for (var i=0;i<p;i++){
        sumKXE=phase+k*xTimesE[i];
        sumReColor+=fCos(sumKXE);
        sumImColor+=fSin(sumKXE);
        phase+=deltaPhase;
    }
}

//  for odd-p rotational symmetry
function colorSumOdd2(k1,k2){
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    var lastXTimesE=xTimesE[p-1];
    var newXTimesE;
    var sumKXE;
    sumReColor=0;
    sumImColor=0;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sumKXE=phase+k1*lastXTimesE+k2*newXTimesE;
        sumReColor+=fCos(sumKXE);
        sumImColor+=fSin(sumKXE);
        lastXTimesE=newXTimesE;
        phase+=deltaPhase;
    }
}