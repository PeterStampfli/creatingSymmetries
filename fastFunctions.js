"use strict";
// utilies for checking, not needed in final version
//==============================================================================

function time(){
	return new Date().getTime();
}

// time the function on a given interval
function timing(start,end,nChecks,theFunction){
	var y=0;
	var x=start;
	var dx=(end-start)/nChecks;
	var startTime=time();
	while (x<end){
		y+=theFunction(x);
		x+=dx;
	}
	console.log("time in seconds. "+(time()-startTime)/1000);
	return y;
}

// time the empty loop for reference
function emptyTiming(start,end,nChecks){
	var y=0;
	var x=start;
	var dx=(end-start)/nChecks;
	var startTime=time();
	while (x<end){
		y+=dx;
		x+=dx;
	}
	console.log("empty loop time in seconds. "+(time()-startTime)/1000);
	return y;
}

//  checking the absolute error of an approximate funstion
function absErrorCheck(start,end,nSteps,trueFunction,approximateFunction){
	var x=start;
	var xMax=0;
	var absError=0;
	var absErrorMax=-1;
	var step=(end-start)/nSteps;
	while (x<=end){
		absError=Math.abs(trueFunction(x)-approximateFunction(x));
		if (absError>absErrorMax){
			absErrorMax=absError;
			xMax=x;
		}
		x+=step;
	}
	console.log("max absolute error: "+absErrorMax+" at "+xMax);
}

//  checking the relative error of an approximate funstion
function relErrorCheck(start,end,step,trueFunction,approximateFunction){
	var x=start;
	var xMax=0;
	var relError=0;
	var relErrorMax=-1;
	var trueValue=0;
	var approximateValue=0;
	while (x<=end){
		trueValue=trueFunction(x);
		approximateValue=approximateFunction(x);
		relError=2*Math.abs(trueValue-approximateValue)/(Math.abs(trueValue)+Math.abs(approximateValue));
		if (relError>relErrorMax){
			relErrorMax=relError;
			xMax=x;
		}
		x+=step;
	}
	console.log("max relative error: "+relErrorMax+" at "+xMax);
}

//  compare the approximate function and a "correct" function
function compare(start,end,step,trueFunction,approximateFunction){
	var x=start;
	var error=0;
	console.log("compare:  x, true function, approximation, error");
	while (x<=end){
		console.log(x+" "+trueFunction(x)+" "+approximateFunction(x)+" "+(approximateFunction(x)-trueFunction(x)));
		x+=step;
	}
}

//==================================================================================================
//=================================================================================================

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

//==================================================================================================
//  the sine and cosine function
// and sharp and sharper
//-------------------------------------------------------------------------------------------
var PIHALF=Math.PI*0.5;

var sinTab=[];
var sharpSinTab=[];
var sharperSinTab=[];
var sinTabLengthM1=0;
var sinTabFactor=1;
var sinTabHigherCorrection=0;

// first terms of the fourier expansion of the triangle function
function sharpSin(x){
	return Math.sin(x)-0.111111*Math.sin(3*x);
}

function sharperSin(x){
	return Math.sin(x)-0.111111*Math.sin(3*x)+0.04*Math.sin(5*x);
}

// set up the table, its length is a power of 2 (plus one for linear interpolation)
function setupSinCosTable(p) {
	var sinTabLength=Math.round(Math.pow(2,p));
 	sinTabLengthM1=sinTabLength-1;
    sinTabFactor = 0.5*sinTabLength/Math.PI;
    sinTabHigherCorrection=0.25/sinTabFactor/sinTabFactor;
    sinTab=makeFunctionTable(sinTabLength+1,0,1.0/sinTabFactor,Math.sin);
    sharpSinTab=makeFunctionTable(sinTabLength+1,0,1.0/sinTabFactor,sharpSin);
    sharperSinTab=makeFunctionTable(sinTabLength+1,0,1.0/sinTabFactor,sharperSin);
}

// approximations for the sine function
//-------------------------------------------------------------------------------------

// looking up the nearest table value
function fastSin(x){
	return sinTab[Math.round(x*sinTabFactor)&sinTabLengthM1];
}

//  using linear interpolation
function fastInterpolatedSin(x){
	x*=sinTabFactor;
	var index=Math.floor(x);
	x-=index;
	index=index&sinTabLengthM1;
	return sinTab[index]*(1-x)+sinTab[index+1]*x;
}

//  using the "quadratic" interpolation
function fastImprovedInterpolatedSin(x){
	x*=sinTabFactor;
	var index=Math.floor(x);
	var dx=x-index;
	index=index&sinTabLengthM1;
	return sinTab[index]*(1-dx)*(1+sinTabHigherCorrection*dx)+sinTab[index+1]*dx*(1+sinTabHigherCorrection*(1-dx));
}

// the cosine function, using a phase shift by PI/2 and the table of the sine function
//----------------------------------------------------------------------

// looking up the nearest table value
function fastCos(x){
	return sinTab[Math.round((x+PIHALF)*sinTabFactor)&sinTabLengthM1];
}

//  using linear interpolation
function fastInterpolatedCos(x){
	x=sinTabFactor*(x+PIHALF);
	var index=Math.floor(x);
	var dx=x-index;
	index=index&sinTabLengthM1;
	return sinTab[index]*(1-dx)+sinTab[index+1]*dx;
}

//  using the "quadratic" interpolation
function fastImprovedInterpolatedCos(x){
	x=sinTabFactor*(x+PIHALF);
	var index=Math.floor(x);
	var dx=x-index;
	index=index&sinTabLengthM1;
	return sinTab[index]*(1-dx)*(1+sinTabHigherCorrection*dx)+sinTab[index+1]*dx*(1+sinTabHigherCorrection*(1-dx));
}

//=========================================================================================
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
    // for the fractional part, x=0 ... 1, excluding 1, the additional point is for interpolation
	expTabFractPart=makeFunctionTable(n+1,0,1.0/expTabFactor,Math.exp);
}

//  approximations for the exponential function
//-------------------------------------------------------------
function fastExp(x){
	var indexToIntPart=Math.floor(x);
	return expTabIntPart[Math.max(0,Math.min(expTabIntPartMaxIndex,indexToIntPart-expMinArgument))]*
	       expTabFractPart[Math.round(expTabFactor*(x-indexToIntPart))];
}

function fastInterpolatedExp(x){
	var indexToIntPart=Math.floor(x);
	var dx=expTabFactor*(x-indexToIntPart);
	var indexToFractPart=Math.floor(dx);
	dx-=indexToFractPart;
	return expTabIntPart[Math.max(0,Math.min(expTabIntPartMaxIndex,indexToIntPart-expMinArgument))]*
	       (expTabFractPart[indexToFractPart]*(1-dx)+expTabFractPart[indexToFractPart+1]*dx);
}

function fastImprovedInterpolatedExp(x){
	var indexToIntPart=Math.floor(x);
	var dx=expTabFactor*(x-indexToIntPart);
	var indexToFractPart=Math.floor(dx);
	dx-=indexToFractPart;
	return expTabIntPart[Math.max(0,Math.min(expTabIntPartMaxIndex,indexToIntPart-expMinArgument))]*
	       (expTabFractPart[indexToFractPart]*(1-dx)*(1-expTabHigherCorrection*dx)
	       	   +expTabFractPart[indexToFractPart+1]*dx*(1-expTabHigherCorrection*(1-dx)));
}

//=============================================================================================
//  part of the inverse tangent
//-------------------------------------------------------------------------------

var atanTab=[];
var atanTabFactor=0;

// for x=0 ... 1, including 1, thus we need n+1 points plus 1 for linear interpolation
function setupAtanTable(n){
	atanTabFactor=n;
	atanTab=makeFunctionTable(n+2,0,1.0/atanTabFactor,Math.atan);
}

// inverse tangent for 0<=x<=1
//-----------------------------------------------------------------
function specialFastAtan(x){
	return atanTab[Math.round(x*atanTabFactor)];
}

function specialFastInterpolatedAtan(x){
	x*=atanTabFactor;
	var index=Math.floor(x);
	x-=index;
	return atanTab[index]*(1-x)+atanTab[index+1]*x;
}

//===============================================================================
// limited part of the logarithm
//--------------------------------------------
/*
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
*/
function specialFastLog(x){
	if (x<logTabXMin){
		return Math.log(x);
	}
	if (x>logTabXMax){
		return Math.log(x);
	}
		return logTab[Math.round(logTabFactor*(x-logTabXMin))];
}

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
