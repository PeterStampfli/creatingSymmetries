"use strict";
//=================================================================================================
// fast approximations
//-------------------------------------
// for all approximations
//=====================================================================================
// returns a table of values of theFunction(x)
// length is the number of values or length of the table
// start is the starting value for x
// delta is the distance between data points
function makeFunctionTable(length,start,delta,theFunction){
    var table=new Array(length);
    for (var i = 0;i<length;i++){
        table[i]=theFunction(start+i*delta);
    }
    return table;
}
//  the sine and cosine function
//-------------------------------------------------------------------------------------------
var PIHALF=Math.PI*0.5;
var PI3HALF=Math.PI*1.5;

var sinTab=[];
var sinTabLengthM1=0;
var sinTabFactor=1;
var sinTabHigherCorrection=0;

// set up the table, its length is a power of 2
function setupSinCosTable(p) {
    var sinTabLength=Math.round(Math.pow(2,p));
    sinTabLengthM1=sinTabLength-1;
    sinTabFactor = 0.5*sinTabLength/Math.PI;
    sinTabHigherCorrection=0.25/sinTabFactor/sinTabFactor;
    sinTab=makeFunctionTable(sinTabLength+1,0,1.0/sinTabFactor,Math.sin);
}

setupSinCosTable(12);

//  using linear interpolation
function fastInterpolatedSin(x){
    x*=sinTabFactor;
    var index=Math.floor(x);
    x-=index;
    index=index&sinTabLengthM1;
    return sinTab[index]*(1-x)+sinTab[index+1]*x;
}

//  using linear interpolation
function fastInterpolatedCos(x){
    x=sinTabFactor*(x+PIHALF);
    var index=Math.floor(x);
    var dx=x-index;
    index=index&sinTabLengthM1;
    return sinTab[index]*(1-dx)+sinTab[index+1]*dx;
}

//  the exponential function
//-----------------------------------------------------------------------

//  possible range of argument (integer part)
var expMaxArgument=Math.floor(Math.log(Number.MAX_VALUE))+1;
var expMinArgument=Math.floor(Math.log(Number.MIN_VALUE));

// tables for integer and fractional part
var expTabIntPart=[];
var expTabIntPartMaxIndex=0;
var expTabFractPart=[];
var expTabFactor=0;
var expTabHigherCorrection=0;

function setupExpTables(n){
    expTabIntPartMaxIndex=expMaxArgument-expMinArgument;
    expTabIntPart=makeFunctionTable(expTabIntPartMaxIndex+1,expMinArgument,1,Math.exp);
    expTabFactor=n;
    expTabHigherCorrection=0.25/expTabFactor/expTabFactor;
    expTabFractPart=makeFunctionTable(n+1,0,1.0/expTabFactor,Math.exp);
}

setupExpTables(1000);

function fastInterpolatedExp(x){
    var indexToIntPart=Math.floor(x);
    var dx=expTabFactor*(x-indexToIntPart);
    var indexToFractPart=Math.floor(dx);
    dx-=indexToFractPart;
    return expTabIntPart[Math.max(0,Math.min(expTabIntPartMaxIndex,indexToIntPart-expMinArgument))]*
           (expTabFractPart[indexToFractPart]*(1-dx)+expTabFractPart[indexToFractPart+1]*dx);
}

// limited part of the logarithm
//--------------------------------------------

var logTab=[];
var logTabFactor=0;
var logTabXMin=0;
var logTabXMax=0;

// accelerating the logarithm for x_min<x<x_max, fallback to Math.log for other values
function setupLogTable(n,xMin,xMax){
    logTabXMin=xMin;
    logTabXMax=xMax;
    logTabFactor=n/(xMax-xMin);
    logTab=makeFunctionTable(n+2,xMin,1.0/logTabFactor,Math.log);
}

setupLogTable(10000,0.5,5);

function specialFastInterpolatedLog(x){
    if (x<logTabXMin){
        return Math.log(x);
    }
    if (x>logTabXMax){
        return Math.log(x);
    }
    x=logTabFactor*(x-logTabXMin);
    var index=Math.floor(x);
    x-=index;
    return logTab[index]*(1-x)+logTab[index+1]*x;
}

//  part of the inverse tangent
//-------------------------------------------------------------------------------

var atanTab=[];
var atanTabFactor=0;

function setupAtanTable(n){
    atanTabFactor=n;
    atanTab=makeFunctionTable(n+2,0,1.0/atanTabFactor,Math.atan);
}

setupAtanTable(1000);

function specialFastInterpolatedAtan(x){
    x*=atanTabFactor;
    var index=Math.floor(x);
    x-=index;
    return atanTab[index]*(1-x)+atanTab[index+1]*x;
}

//================================================================================
// on the output canvas, the coordinates range is x,y=-2 ... +2
//  for easy work with inversion
//  then a mapping is done, resulting in xImage and yImage
// then a pixel address is put in the table
// a unit length corresponds
// ========================================================================

var mapScale=0;
var mapOffsetI=0;
var mapOffsetJ=0;




var logR=0;
var phi=0;

var xImage=0;
var yImage=0;




function rosetteMapTables() {
 
    function storeImage(i,j){
        index=mapSize*j+i;
        mapXTab[index] = xImage;
        mapYTab[index] = yImage;
    }

    var mapSize = mapWidth;
    var mapSizeHalf = mapWidth / 2;
    var normFactor=4.0/mapWidth;
    var index = 0;
    var iBase,jBase;
    var x=0;
    var y=0;
    var phiBase=0;
   //  using 8 sectors
    for (iBase = 0; iBase < mapSizeHalf; iBase++) {
       	x=normFactor*(iBase+0.5);
        for (jBase=0;jBase<=iBase;jBase++) {
     		y=normFactor*(jBase+0.5);
     		logR=0.5*specialFastInterpolatedLog(x*x+y*y);
            phiBase=specialFastInterpolatedAtan(y/x);
            // sector 1
            phi=phiBase;
            mapping();
            storeImage(mapSizeHalf+iBase,mapSizeHalf+jBase);
            // sector 2, change that for mirror symmetry
            phi=PIHALF-phiBase;
            mapping();
            storeImage(mapSizeHalf+jBase,mapSizeHalf+iBase);
            // sector 3, 
            phi=PIHALF+phiBase;
            mapping();
            storeImage(mapSizeHalf-1-jBase,mapSizeHalf+iBase);
            // sector 4, change that for mirror symmetry
            phi=Math.PI-phiBase;
            mapping();
            storeImage(mapSizeHalf-1-iBase,mapSizeHalf+jBase);
            // sector 5, change that for mirror symmetry
            phi=Math.PI+phiBase;
            mapping();
            storeImage(mapSizeHalf-1-iBase,mapSizeHalf-1-jBase);
            // sector 6, change that for mirror symmetry
            phi=PI3HALF-phiBase;
            mapping();
            storeImage(mapSizeHalf-1-jBase,mapSizeHalf-1-iBase);
            // sector 7, change that for mirror symmetry
            phi=PI3HALF+phiBase;
            mapping();
            storeImage(mapSizeHalf+jBase,mapSizeHalf-1-iBase);
            // sector 8, change that for mirror symmetry
            phi=-phiBase;
            mapping();
            storeImage(mapSizeHalf+iBase,mapSizeHalf-1-jBase);
        }
    }
}

// other symmetry dependent parts
//=============================================================================

// initial mapping scale
//  (x,y) coordinates to pixels
scaleOutputToInput = 200

// the replacement color for outside pixels
var outsideRed = 100;
var outsideGreen = 100;
var outsideBlue = 100;

// invert the color
function invert(){
    pixelRed=255-pixelRed;
    pixelGreen=255-pixelGreen;
    pixelBlue=255-pixelBlue;
}

//get the color of a pixel, trivial case, no color symmetry
function makePixelColor(x,y){
    if (y>0){
        sampleInput(x,y);
    }
    else {
        sampleInput(x,-y);
        pixelRed=255-pixelRed;
        pixelGreen=255-pixelGreen;
        pixelBlue=255-pixelBlue;    
    }
}


function imageZero(){
    xImage=0;
    yImage=0;
}

// the complex variant
function imageAdd(re,im,rPower,phiPower){
    var interIm=fastInterpolatedExp(rPower*logR);
    var interRe=interIm*fastInterpolatedCos(phiPower*phi);
    interIm=interIm*fastInterpolatedSin(phiPower*phi);
    xImage+=re*interRe-im*interIm;
    yImage+=re*interIm+im*interRe;
}

// the real parts
function imageAddR(a,b,c,d,rPower,phiPower){
    var rk=fastInterpolatedExp(rPower*logR);
    var rkSinPhi=phiPower*phi;
    var rkCosPhi=rk*fastInterpolatedCos(rkSinPhi);
    rkSinPhi=rk*fastInterpolatedSin(rkSinPhi);
    xImage+=a*rkCosPhi+b*rkSinPhi;
    yImage+=c*rkCosPhi+d*rkSinPhi;
}

function mapping(){
    imageZero();
    imageAdd(1,0,2,6);
    imageAdd(1,0,-2,-6);
  //  imageAdd(0,0.5,3,-12);
  //  imageAdd(0,0.5,3,12);

}
