"use strict";

/*
test and time functions and their approximation
*/
function FunTest(){
	this.nothing=function(x){return x;};
	this.approxFunction=function(x){return x;};
	this.trueFunction=function(x){return x;};
}

/*
check for maximum absolute error
*/
FunTest.prototype.absError=function(start,end,nSteps){
	var x=start;
	var xMax=0;
	var absError=0;
	var absErrorMax=start;
	var step=(end-start)/nSteps;
	while (x<=end){
		absError=Math.abs(this.trueFunction(x)-this.approxFunction(x));
		if (absError>absErrorMax){
			absErrorMax=absError;
			xMax=x;
		}
		x+=step;
	}
	console.log("max absolute error: "+absErrorMax+" at "+xMax);
}

/*
check for maximum relative error
*/
FunTest.prototype.relError=function(start,end,nSteps){
	var x=start;
	var xMax=0;
	var relError=0;
	var relErrorMax=start;
	var step=(end-start)/nSteps;
	var trueValue,approxValue;
	while (x<=end){
		trueValue=this.trueFunction(x);
		approxValue=this.approxFunction(x);
		relError=2*Math.abs(trueValue-approxValue)/(Math.abs(trueValue)+Math.abs(approxValue));
		if (relError>relErrorMax){
			relErrorMax=relError;
			xMax=x;
		}
		x+=step;
	}
	console.log("max relative error: "+relErrorMax+" at "+xMax);
}


//  compare the approximate function and a "correct" function
FunTest.prototype.compare=function(start,end,nSteps){
	var x=start;
	var step=(end-start)/nSteps;
	var error;
	console.log(this.approxFunction);
	console.log("compare:  x, true function, approximation, error");
	while (x<=end){
		error=(this.approxFunction(x)-this.trueFunction(x));
		console.log(x.toPrecision(3)+" "+this.trueFunction(x).toPrecision(3)
			+" "+this.approxFunction(x).toPrecision(3)
			+" "+error.toPrecision(3));
		x+=step;
	}
}

//  time the approximate function and a "correct" function
// test time should be at least tenths of seconds
FunTest.prototype.timing=function(start,end,nSteps){
	var step=(end-start)/nSteps;
	var x,sum,time;
	x=start;
	sum=0;
	time=new Date().getTime();
	while (x<=end){
		sum+=this.trueFunction(x);
		x+=step;
	}
	time=0.001*(new Date().getTime()-time);
	console.log("time for true function: "+time.toPrecision(3));
	x=start;
	sum=0;
	time=new Date().getTime();
	while (x<=end){
		sum+=this.approxFunction(x);
		x+=step;
	}
	time=0.001*(new Date().getTime()-time);
	console.log("time for approximate function: "+time.toPrecision(3));
		x=start;
	sum=0;
	time=new Date().getTime();
	while (x<=end){
		sum+=this.nothing(x);
		x+=step;
	}
	time=0.001*(new Date().getTime()-time);
	console.log("time for nothing function: "+time.toPrecision(3));


}