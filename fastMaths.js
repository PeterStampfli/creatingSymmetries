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