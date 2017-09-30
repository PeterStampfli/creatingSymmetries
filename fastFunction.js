"use strict";

/*
approximating functions with linear table interpolation
*/

function FastFun(){
	this.tabFactor;
	this.table=[];
	this.nIntervalsM1;
	this.nIntervalls4;
}

/*
make the table, length is number of intervalls plus 1 for interpolation
*/
FastFun.prototype.makeTable=function(start,end,nIntervals,theFunction){
	var step=(end-start)/nIntervals;
	var x=start;
	this.tabFactor=1/step;
	this.table.length=nIntervals+1;
	console.log(this.table);
	for (var i=0;i<=nIntervals;i++){
		this.table[i]=theFunction(x);
		x+=step;
	}
}

/*
make a table for a periodic function with a power of 2 number of intervalls
period length is 2pi
*/
FastFun.prototype.makePeriodicTable=function(log2NIntervals,theFunction){
	var nIntervals=Math.round(Math.pow(2,log2NIntervals));
	this.nIntervals=nIntervals/4;
	this.nIntervalsM1=nIntervals-1;
	this.makeTable(0,2*Math.PI,nIntervals,theFunction);
}

/*
interpolate periodic function directly
assuming that table is a sine-like function you get this sine-like function
*/
FastFun.prototype.sinLike=function(x){
	var index;
	x*=this.tabFactor;
	index=Math.floor(x);
	x-=index;
	index=index&this.nIntervalsM1;
	return this.table[index++]*(1-x)+this.table[index]*x;
}