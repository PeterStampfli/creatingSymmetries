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

var ex=[];
var ey=[];
var xTimesE=[];

function oddUnitvectors(p){
    ex.length=p;
    ey.length=p;
    xTimesE.length=p;
    var q=Math.floor(p/2);
    for (var i=0;i<p;i++){
        ex[i]=fCos(2*Math.PI*(i-q)/p);
        ey[i]=fSin(2*Math.PI*(i-q)/p);
    }
}

var p=5;
oddUnitvectors(p);
 console.log(ex);
        console.log(ey);

function xTimesUnitvectors(x,y){

    for (var i=0;i<p;i++){
        xTimesE[i]=x*ex[i]+y*ey[i];
    }

}

// single wavevectors, sine or cosine

function sumCosines(k){
    var sum=0;
     for (var i=0;i<p;i++){
        sum+=fCos(k*xTimesE[i]);
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

/*
function sumCosines(k1,k2){
    var sum=fCos(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fCos(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}

function sumSines(k1,k2){
    var sum=fSin(k1*xTimesE[p-1]+k2*xTimesE[0]);
     for (var i=1;i<p;i++){
        sum+=fSin(k1*xTimesE[i-1]+k2*xTimesE[i]);
    }
    return sum;
}
*/
function prodCosines(k){
    var prod=1;
    for (var i=0;i<p;i++){
        prod*=fCos(k*xTimesE[i]);
    }
    return prod;
}

function quasiperiodicMapping(x,y){
    xTimesUnitvectors(x,y);
    imageZero();
    xImage+=sumCosines(2);
    yImage+=sumSines(2);
    uImage=prodCosines(1);

}

//=====================================
var mapping=quasiperiodicMapping;
scaleOutputToInput = 200
