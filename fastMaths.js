"use strict";

// some useful numerical constants

var RT3HALF=Math.sqrt(3)/2;
var PIHALF=Math.PI*0.5;

//=================================================================================================
// fast approximations of functions
//=====================================================================================

//  make a function table
// ----------------------------------------------------------------
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
var sinTab=[];
var sinTabLengthM1=0;
var sinTabFactor=1;

// set up the table, its length is a power of 2
function setupSinCosTable(p) {
    var sinTabLength=Math.round(Math.pow(2,p));
    sinTabLengthM1=sinTabLength-1;
    sinTabFactor = 0.5*sinTabLength/Math.PI;
    sinTab=makeFunctionTable(sinTabLength+1,0,1.0/sinTabFactor,Math.sin);
}

setupSinCosTable(12);

//  using linear interpolation
function fSin(x){
    x*=sinTabFactor;
    var index=Math.floor(x);
    x-=index;
    index=index&sinTabLengthM1;
    return sinTab[index]*(1-x)+sinTab[index+1]*x;
}

//  using linear interpolation
function fCos(x){
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

function setupExpTables(n){
    expTabIntPartMaxIndex=expMaxArgument-expMinArgument;
    expTabIntPart=makeFunctionTable(expTabIntPartMaxIndex+1,expMinArgument,1,Math.exp);
    expTabFactor=n;
    expTabFractPart=makeFunctionTable(n+1,0,1.0/expTabFactor,Math.exp);
}

setupExpTables(1000);

function fExp(x){
    var indexToIntPart=Math.floor(x);
    var dx=expTabFactor*(x-indexToIntPart);
    var indexToFractPart=Math.floor(dx);
    dx-=indexToFractPart;
    return expTabIntPart[Math.max(0,Math.min(expTabIntPartMaxIndex,indexToIntPart-expMinArgument))]*
           (expTabFractPart[indexToFractPart]*(1-dx)+expTabFractPart[indexToFractPart+1]*dx);
}

// the logarithm
//----------------------------------------------------------------------------

var logTab=[];
var logTabFactor=0;
var logTabXMin=0;
var logTabXMax=0;

// accelerating the logarithm for x_min<x<x_max, fallback to Math.log for other values
function setupLogTable(n,xMin,xMax){
    logTabXMin=xMin;
    logTabXMax=xMax;
    logTabFactor=n/(xMax-xMin);
    logTab=makeFunctionTable(n+2,xMin,1.0/logTabFactor,Math.log);   // plus 2 because includes upper limit and one data point for linbear interpolation
}

setupLogTable(1000,1,2.718281828);

function fLog(x){
    if (x<1){
        return -fLog(1/x);
    }
    var ln=0;
    if (x>=2.904884967e13){                 // e^31
        return Math.log(x);
    }
    if (x>=8886110.52){                     // e^16
        ln=16;
        x*=1.1253517471926e-7;
    }
    if (x>=2980.9579){                     // e^8
        ln+=8;
        x*=0.00033546262;
    }
    if (x>=54.598150){                     // e^4
        ln+=4;
        x*=0.01831563;
    }
    if (x>=7.38905609){                     // e^2
        ln+=2;
        x*=0.13533528;
    }
    if (x>=2.7182818){                     // e
        ln++;
        x*=0.36787944;
    }
    x=logTabFactor*(x-logTabXMin);
    var index=Math.floor(x);
    x-=index;
    return ln+logTab[index]*(1-x)+logTab[index+1]*x;
}

//  the atan2 function
//----------------------------------------------------------------------

var atanTab=[];
var atanTabFactor=0;

// for x=0 ... 1, including 1, thus we need n+1 points plus 1 for linear interpolation
function setupAtanTable(n){
    atanTabFactor=n;
    atanTab=makeFunctionTable(n+2,0,1.0/atanTabFactor,Math.atan);
}

setupAtanTable(1000);

function fAtan2(y,x){
    var index;
    if (x>=0){
        if (y>0) {
            if (x>y) {
                x=atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return atanTab[index]*(1-x)+atanTab[index+1]*x;
            }
            else {
                x=atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return 1.5707963268-(atanTab[index]*(1-x)+atanTab[index+1]*x);
            }
        }
        else {
            if (x>-y){
                x=-atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return -(atanTab[index]*(1-x)+atanTab[index+1]*x);
            }
            else {
                x=-atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return -1.5707963268+atanTab[index]*(1-x)+atanTab[index+1]*x;
            }
        }
    }
    else {
        if (y>=0){
            if (x<-y){
                x=-atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return 3.1415926536-(atanTab[index]*(1-x)+atanTab[index+1]*x);
            }
            else {
                x=-atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return 1.5707963268+atanTab[index]*(1-x)+atanTab[index+1]*x;
            }
        }
        else {
            if (x<y){
                x=atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return -3.1415926536+atanTab[index]*(1-x)+atanTab[index+1]*x;
            }
            else {
                x=atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return -1.5707963268-(atanTab[index]*(1-x)+atanTab[index+1]*x);
            }
        }
    }
}
