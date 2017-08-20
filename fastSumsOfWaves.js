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

// for image mapping (odd p and even 2p rotational symmetry)
function makeSumSharpCosines(k){
    var sum=0;
    var phase;
    for (var i=0;i<p;i++){
        phase=k*xTimesE[i];
        sum+=fCos(phase)+0.11111*fCos(3*phase);
    }
    return sum;
}

// for image mapping (odd p and even 2p rotational symmetry)
function makeSumSharperCosines(k){
    var sum=0;
    var phase;
    for (var i=0;i<p;i++){
        phase=k*xTimesE[i];
        sum+=fCos(phase)+0.11111*fCos(3*phase)+0.04*fCos(5*phase);
    }
    return sum;
}

// for image mapping (odd p and even 2p rotational symmetry)
function makeSumSharpestCosines(k){
    var sum=0;
    for (var i=0;i<p;i++){
        sum+=triangleCos(k*xTimesE[i]);
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

function makeSumSharpSines(k){
    var sum=0;
    var phase;
     for (var i=0;i<p;i++){
        phase=k*xTimesE[i];
        sum+=fSin(phase)-0.111111*fSin(3*phase);
    }
    return sum;
}

function makeSumSharperSines(k){
    var sum=0;
    var phase;
     for (var i=0;i<p;i++){
        phase=k*xTimesE[i];
        sum+=fSin(phase)-0.111111*fSin(3*phase)+0.04*fSin(5*phase);
    }
    return sum;
}

function makeSumSharpestSines(k){
    var sum=0;
     for (var i=0;i<p;i++){
        sum+=triangleSin(k*xTimesE[i]);
    }
    return sum;
}

//  image mapping: making sums for wavevectors with two neighboring non-zero coefficients

//  for odd-p and even rotational symmetry
function makeSumCosines2(k1,k2){
    var sum=0;
    var lastXTimesE=evenOddSign*xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}


function makeSumSharpCosines2(k1,k2){
    var sum=0;
    var phase;
    var lastXTimesE=evenOddSign*xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        phase=k1*lastXTimesE+k2*newXTimesE;
        sum+=fCos(phase)+0.11111*fCos(3*phase);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

function makeSumSharperCosines2(k1,k2){
    var sum=0;
    var phase;
    var lastXTimesE=evenOddSign*xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        phase=k1*lastXTimesE+k2*newXTimesE;
        sum+=fCos(phase)+0.11111*fCos(3*phase)+0.04*fCos(5*phase);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

function makeSumSharpestCosines2(k1,k2){
    var sum=0;
    var lastXTimesE=evenOddSign*xTimesE[p-1];
    var newXTimesE;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=triangleCos(k1*lastXTimesE+k2*newXTimesE);
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

//  color symmetries
// for 2-color symmetry (2p-rotational symmetry with even p)
function makeSumAlternatingCosines2(k1,k2){
    var sum=0;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
    var factor=1;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=factor*fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
        factor=-factor;
    }
    return sum;
}

// for 2-color symmetry (2p-rotational symmetry with odd p)
function makeSumAlternatingSines(k){
    var sum=0;
    var factor=1;
    for (var i=0;i<p;i++){
        sum+=factor*fSin(k*xTimesE[i]);
        factor=-factor;
    }
    return sum;
}

//  color symmetries
// for 2-color symmetry (2p-rotational symmetry with odd p)
function makeSumAlternatingSines2(k1,k2){
    var sum=0;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
    var factor=1;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        sum+=factor*fSin(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
        factor=-factor;
    }
    return sum;
}

// for color symmetry with odd-p rotational symmetry
// calculate basic w-wave
function colorSumOdd(k){
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    sumReColor=0;
    sumImColor=0;
    for (var i=0;i<p;i++){
        fCosSinValues(phase+k*xTimesE[i]);
        sumReColor+=cosValue;
        sumImColor+=sinValue;
        phase+=deltaPhase;
    }
}

//  for odd-p rotational symmetry
function colorSumOdd2(k1,k2){
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    var lastXTimesE=xTimesE[p-1];
    var newXTimesE;
    sumReColor=0;
    sumImColor=0;
    for (var i=0;i<p;i++){
        newXTimesE=xTimesE[i];
        fCosSinValues(phase+k1*lastXTimesE+k2*newXTimesE);
        sumReColor+=cosValue;
        sumImColor+=sinValue;
        lastXTimesE=newXTimesE;
        phase+=deltaPhase;
    }
}

// for color symmetry with even-2p rotational symmetry
// calculate basic w-wave
function colorSumEven(k){
    sumReColor=0;
    sumImColor=0;
    var h;
    if (p2DivNOdd){
        for (var i=0;i<p;i++){
            h=fSin(k*xTimesE[i]);
            sumReColor+=-sin2PiHDivN[i]*h;
            sumImColor+=cos2PiHDivN[i]*h;
        }
    }
    else {
        for (var i=0;i<p;i++){
            h=fCos(k*xTimesE[i]);
            sumReColor+=cos2PiHDivN[i]*h;
            sumImColor+=sin2PiHDivN[i]*h;
        }
    }
}

// for color symmetry with even-2p rotational symmetry
// calculate basic w-wave
function colorSumEven2(k1,k2){
    sumReColor=0;
    sumImColor=0;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
    var h;
    if (p2DivNOdd){
        for (var i=0;i<p;i++){
            newXTimesE=xTimesE[i];
            h=fSin(k1*lastXTimesE+k2*newXTimesE);
            sumReColor+=-sin2PiHDivN[i]*h;
            sumImColor+=cos2PiHDivN[i]*h;
           lastXTimesE=newXTimesE;
        }
    }
    else {
        for (var i=0;i<p;i++){
            newXTimesE=xTimesE[i];
            h=fCos(k1*lastXTimesE+k2*newXTimesE);
            sumReColor+=cos2PiHDivN[i]*h;
            sumImColor+=sin2PiHDivN[i]*h;
            lastXTimesE=newXTimesE;
        }
    }
}

//  morphing
//  2p fold rotational symmetry in 2 parts, for even p

// lower set
function sumCosinesLower(k){
    var sum=0;
    for (var i=0;i<p-1;i+=2){
        sum+=fCos(k*xTimesE[i]);
    }
    return sum;
}
// upper set
function sumCosinesUpper(k){
    var sum=0;
    for (var i=1;i<p;i+=2){
        sum+=fCos(k*xTimesE[i]);
    }
    return sum;
}

// lower set, two waves, difference is 2
function makeSumCosinesEven2Lower(k1,k2){
    var sum=0;
    var lastXTimesE=-xTimesE[p-2];
    var newXTimesE;
    for (var i=0;i<p-1;i+=2){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}

// upper set, two waves, difference is 2
function makeSumCosinesEven2Lower(k1,k2){
    var sum=0;
    var lastXTimesE=-xTimesE[p-1];
    var newXTimesE;
    for (var i=1;i<p;i+=2){
        newXTimesE=xTimesE[i];
        sum+=fCos(k1*lastXTimesE+k2*newXTimesE);
        lastXTimesE=newXTimesE;
    }
    return sum;
}
