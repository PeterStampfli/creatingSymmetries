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
	console.log(nChecks+" function evaluations: time in seconds "+(time()-startTime)/1000);
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
	console.log(nChecks+" times the empty loop: time in seconds "+(time()-startTime)/1000);
	return y;
}

//  checking the absolute error of an approximate funstion
function absErrorCheck(start,end,step,trueFunction,approximateFunction){
	var x=start;
	var xMax=0;
	var absError=0;
	var absErrorMax=-1;
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
