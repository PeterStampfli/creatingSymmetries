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
var sumColorSines;
var sumColorCosines;

function sumWavevectorOdd(kValues){
    setWavevector(arguments);
    var deltaPhase=2*Math.PI/nColors;
    var phase=0;
    var sumKXE=0;
    sumSines=0;
    sumCosines=0;
    sumColorSines=0;
    sumColorCosines=0;
    for (var i=0;i<p;i++){
        sumKXE=sumKtimesXE();
        sumCosines+=fCos(sumKXE);
        sumSines+=fSin(sumKXE);
        sumColorCosines+=fCos(phase+sumKXE);
        sumColorSines+=fSin(phase+sumKXE);
        rotateWavevectorOdd();
        phase+=deltaPhase;
    }
}

function xImageAdd(a,b){
    xImage+=a*sumSines+b*sumCosines;
}

function yImageAdd(a,b){
    yImage+=a*sumSines+b*sumCosines;
}

function wImageAddOdd(a,b){
    uImage+=a*sumColorCosines-b*sumColorSines;
    vImage+=b*sumColorCosines+a*sumColorSines;
}



// prepare things that are same for each point
function startMapping(){
    p=3;
    nColors=3;
    chooseColorSymmetry();
    sinCosPhases();
    unitvectorsOdd(p);
}

// depends on each point
function quasiperiodicMapping(x,y){
    xTimesUnitvectors(x,y);
    imageZero();
    sumWavevectorOdd(1);
    
    xImageAdd(1,0);
    yImageAdd(0,1);
    wImageAddOdd(1,0);
    //normalizeUV();
 //  uImage=sumAlternatingCosines(1);

}

var p;
var nColors;


//=====================================
var mapping=quasiperiodicMapping;
scaleOutputToInput = 100
