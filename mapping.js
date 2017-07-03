"use strict";
//===============================================================================
//===============================================================================
//
//   rosette images
//
//=============================================================================
//===============================================================================

// initial mapping scale
//  (x,y) plane length unit to pixels
scaleOutputToInput = 200

//  make the mapping that defines the symmetry
var logR=0;
var phi=0;
var rkCosPhi;
var rkSinPhi;

// initialization
function imageZero(){
    xImage=0;
    yImage=0;
    uImage=0;
    vImage=0;
}

// multiple calls for smoothing ???
function rAndPhi(x,y){
    logR=0.5*Math.log(y*y+x*x);
    phi=Math.atan2(y,x);
}

// precompute powers (exponents) for r and sine and cosine for phi
function imagePowers(rPower,phiPower){
    var rk=fExp(rPower*logR);
    rkCosPhi=rk*fCos(phiPower*phi);
    rkSinPhi=rk*fSin(phiPower*phi);
}

function xImageAdd(a,b){
    xImage+=a*rkCosPhi+b*rkSinPhi;
}

function yImageAdd(a,b){
    yImage+=a*rkCosPhi+b*rkSinPhi;
}

function uImageAdd(a,b){
    uImage+=a*rkCosPhi+b*rkSinPhi;
}

function vImageAdd(a,b){
    vImage+=a*rkCosPhi+b*rkSinPhi;
}

function rosetteMapping(x,y){
    imageZero();
    rAndPhi(x,y);
    imagePowers(2,6);
    xImageAdd(1,0);
    yImageAdd(0,1);
    imagePowers(1,2);
    uImageAdd(1,0);
    vImageAdd(0,1);
    imagePowers(2,-4);
  //  uImageAdd(0,-3);
  //  vImageAdd(3,0);
}

  //========================================================================================

  // quasiperiodic
//========================
// the unit vectors
var ex=[];
var ey=[];
var xTimesE=[];

// unit vectors for odd number of rotational symmetry (odd p)
function unitvectorsOdd(p){
    ex.length=p;
    ey.length=p;
    xTimesE.length=p;
    var q=(p-1)/2;
    for (var i=0;i<p;i++){
        ex[i]=fCos(2*Math.PI*(i-q)/p);
        ey[i]=fSin(2*Math.PI*(i-q)/p);
    }
}

// unit vectors for even number of rottaional symmetry (even or odd p)
function unitvectorsEven(p){
    ex.length=p;
    ey.length=p;
    xTimesE.length=p;
    var q=p/2;
    for (var i=0;i<p;i++){
        ex[i]=fCos(Math.PI*(i-q+0.5)/p);
        ey[i]=fSin(Math.PI*(i-q+0.5)/p);
    }
}

// calculate scalar products between x and unit vectors
function xTimesUnitvectors(x,y){
    for (var i=0;i<p;i++){
        xTimesE[i]=x*ex[i]+y*ey[i];
    }
}

// for color symmetry: sines and cosines of phases
var cos2PiHDivN=[];
var sin2PiHDivN=[];

function sinCosPhases(){
    cos2PiHDivN.length=p;
    sin2PiHDivN.length=p;
    for (var h=0;h<p;h++){
        cos2PiHDivN[h]=fCos(2*Math.PI*h/nColors);
        sin2PiHDivN[h]=fSin(2*Math.PI*h/nColors);
    }
}

function normalizeUV(){
    var norm=1.0/Math.sqrt(uImage*uImage+vImage*vImage);
    uImage*=norm;
    vImage*=norm;
}

// single wavevectors, sine or cosine

function sumCosines(k){
    var sum=0;
     for (var i=0;i<p;i++){
        sum+=fCos(k*xTimesE[i]);
    }
    return sum;
}

function sumAlternatingCosines(k){
    var sum=0;
    var factor=1;
     for (var i=0;i<p;i++){
        sum+=factor*fCos(k*xTimesE[i]);
        factor=-factor;
    }
    return sum;
}

function sumSines(k){
    var sum=0;
     for (var i=0;i<p;i++){
        sum+=fSin(k*xTimesE[i]);
    }
    return sum;
}


function sumCosines2Odd(k1,k2){
    var sum=fCos(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fCos(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

function sumCosines2Even(k1,k2){
    var sum=fCos(-k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fCos(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

function sumSines2Odd(k1,k2){
    var sum=fSin(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fSin(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

function prodCosines(k){
    var prod=1;
    for (var i=0;i<p;i++){
        prod*=fCos(k*xTimesE[i]);
    }
    return prod;
}

function sumPhasedCosines(k){
    var sum=0;
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    for (var i=0;i<p;i++){
        sum+=fCos(phase+k*xTimesE[i]);
        phase+=deltaPhase;
    }
    return sum;    
}

function sumPhasedSines(k){
    var sum=0;
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    for (var i=0;i<p;i++){
        sum+=fSin(phase+k*xTimesE[i]);
        phase+=deltaPhase;
    }
    return sum;    
}

// prepare things that are same for each point
function startMapping(){
    p=9;
    sinCosPhases();
    unitvectorsOdd(p);
}

// depends on each point
function quasiperiodicMapping(x,y){
    xTimesUnitvectors(x,y);
    imageZero();
    xImage+=sumCosines(1);
    yImage+=sumSines(1);
    uImage=sumPhasedCosines(1);
    vImage=sumPhasedSines(1);
    //normalizeUV();
 //  uImage=sumAlternatingCosines(1);

}

var p;
var nColors=3;


//=====================================
var mapping=quasiperiodicMapping;
scaleOutputToInput = 100
