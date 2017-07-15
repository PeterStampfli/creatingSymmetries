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
var wavevector=[];

// unit vectors for odd number of rotational symmetry (odd p)
function unitvectorsOdd(p){
    ex.length=p;
    ey.length=p;
    xTimesE.length=p;
    wavevector.length=p;
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
    wavevector.length=p;
    var q=p/2;
    for (var i=0;i<p;i++){
        ex[i]=fCos(Math.PI*(i-q+0.5)/p);
        ey[i]=fSin(Math.PI*(i-q+0.5)/p);
    }
}

//  rotate the wavevector

// set the wavevector: setWaveVector(kArray);

function setWavevector(kValues){
    var i;
    var limit=Math.min(kValues.length,wavevector.length);
    for (i=0;i<limit;i++) {
        wavevector[i]=kValues[i];
    } 
    for (i=kValues.length;i<wavevector.length;i++){
        wavevector[i]=0;
    }
}

// for odd dimensional space: straight rotation

function shiftWavevectorDown(){
    for (var i = 1; i < p; i++) {
        wavevector[i-1]=wavevector[i];
    }
}

function rotateWavevectorOdd(){
    var h=wavevector[0];
    shiftWavevectorDown();
    wavevector[p-1]=h;
}

// for even dimensional space (or even rotational symmetry from odd dimensional space): rotation with change of sign
function rotateWavevectorEven(){
    var h=wavevector[0];
    shiftWavevectorDown();
    wavevector[p-1]=-h;
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
var p2DivNOdd;

function sinCosPhases(){
    p2DivNOdd=(2*p/nColors)%2==1;
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


// wavepakets

// sum of the argument for a single wave
function sumKtimesXE(){
    var kTimesXTimesE=0;
    for (var j = 0; j < p; j++) {
        kTimesXTimesE+=wavevector[j]*xTimesE[j];
    }
    return kTimesXTimesE;
}


//making the pakets

var sumSines;
var sumCosines;
// for color symmetry
var sumImColor;
var sumReColor;

function sumWavevectorOdd(kValues){
    setWavevector(arguments);
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    var sumKXE=0;
    sumSines=0;
    sumCosines=0;
    sumImColor=0;
    sumReColor=0;
    for (var i=0;i<p;i++){
        sumKXE=sumKtimesXE();
        sumCosines+=fCos(sumKXE);
        sumSines+=fSin(sumKXE);
        sumReColor+=fCos(phase+sumKXE);
        sumImColor+=fSin(phase+sumKXE);
        rotateWavevectorOdd();
        phase+=deltaPhase;
    }
}

function sumWavevectorEven(kValues){
    setWavevector(arguments);
    var sumKXE=0;
    sumSines=0;
    sumCosines=0;
    sumImColor=0;
    sumReColor=0;
    for (var i=0;i<p;i++){
        sumKXE=sumKtimesXE();
        sumCosines+=fCos(sumKXE);
        if (p2DivNOdd){
            var sinSumKXE=fSin(sumKXE);
            sumReColor+=-sin2PiHDivN[i]*sinSumKXE;
            sumImColor+=cos2PiHDivN[i]*sinSumKXE;
        }
        else {
            var cosSumKXE=fCos(sumKXE);
            sumReColor+=cos2PiHDivN[i]*cosSumKXE;
            sumImColor+=sin2PiHDivN[i]*cosSumKXE;
        }
         rotateWavevectorEven();
    }
}

// for image symmetry mapping

function xImageAdd(a,b){
    xImage+=a*sumCosines+b*sumSines;
}

function yImageAdd(a,b){
    yImage+=a*sumCosines+b*sumSines;
}

// for color symmetry mapping
// rotational color symmetry
function wImageAddOdd(a,b){
    uImage+=a*sumReColor-b*sumImColor;
    vImage+=b*sumReColor+a*sumImColor;
}

//  for mirror symmetry and 2-color symmetry???
function uImageAdd(a,b){
    uImage+=a*sumSines+b*sumCosines;
}

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
function makeSumCosinesOdd(k1,k2){
    var sum=fCos(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fCos(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

function makeSumSinesOdd(k1,k2){
    var sum=fSin(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fSin(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

// for even 2p-rotational symmetry

function makeSumCosinesEven(k1,k2){
    var sum=fCos(-k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fCos(k1*xTimesE[i-1]+k2*xTimesE[i]);
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

function colorsumPhased(k){
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    sumReColor=0;
    sumImColor=0;
    for (var i=0;i<p;i++){
        sumReColor+=fCos(phase+k*xTimesE[i]);
        sumImColor+=fSin(phase+k*xTimesE[i]);
        phase+=deltaPhase;
    }
    return sum;    
}


// prepare things that are same for each point
function startMapping(){
    p=5;
    nColors=2;
    chooseColorSymmetry();
    sinCosPhases();
  //  unitvectorsOdd(p);
    unitvectorsEven(p);
}

// depends on each point
function quasiperiodicMapping(x,y){
    xTimesUnitvectors(x,y);
    imageZero();
   // sumWavevectorOdd(1);
    //sumWavevectorEven(1);
    
    xImage=makeSumCosines(1);
    sumWavevectorEven(1,1);

    yImageAdd(1,0);
 //   wImageAddOdd(1,0);
    //normalizeUV();
 //  uImage=sumAlternatingCosines(1);

}

var p;
var nColors;


//=====================================
var mapping=quasiperiodicMapping;
scaleOutputToInput = 100
