"use strict";

/*
approximating functions with linear table interpolation
*/

function FastFun(){
	this.tabFactor;
	this.table=[];
	this.nIntervalsM1;
	this.expMaxArgument=Math.floor(Math.log(Number.MAX_VALUE))+1;
	this.expMinArgument=Math.floor(Math.log(Number.MIN_VALUE));
	this.expTabIntPartMaxIndex=this.expMaxArgument-this.expMinArgument;
	this.expTabIntPart=[];

}

/*
make the table, length is number of intervalls plus 1 for interpolation
*/
FastFun.prototype.makeTable=function(start,end,nIntervals,theFunction){
	var step=(end-start)/nIntervals;
	var x=start;
	this.tabFactor=1/step;
	this.table.length=nIntervals+1;
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

/*
interpolate periodic function with a shift by pi/2
assuming that table is a sine-like function you get this cos-like function
*/
FastFun.prototype.cosLike=function(x){
	var index;
	x=this.tabFactor*(x+1.570796);                            //pi/2
	index=Math.floor(x);
	x-=index;
	index=index&this.nIntervalsM1;
	return this.table[index++]*(1-x)+this.table[index]*x;
}

/*
setup table for exponential function
*/
FastFun.prototype.makeExpTable=function(nIntervals){
	this.expTabIntPart.length=this.expTabIntPartMaxIndex+1;
	for (var i=0;i<=this.expTabIntPartMaxIndex;i++){
		this.expTabIntPart[i]=Math.exp(this.expMinArgument+i);
	}
	this.makeTable(0,1,nIntervals,Math.exp);
}

/*
the exponential function
(seems to be faster in forefox, but not in chrome)
*/
FastFun.prototype.exp=function(x){
	var indexToIntPart,indexToFractPart;
	indexToIntPart=Math.floor(x);
	x=this.tabFactor*(x-indexToIntPart);
	indexToFractPart=Math.floor(x);
	x-=indexToFractPart;
	return this.expTabIntPart[Math.max(0,Math.min(this.expTabIntPartMaxIndex,indexToIntPart-this.expMinArgument))]*
	       (this.table[indexToFractPart++]*(1-x)+this.table[indexToFractPart]*x);
}	

/*
setup table for log function: values between 1 and e
*/
FastFun.prototype.makeLogTable=function(nIntervals){
	this.makeTable(1,Math.exp(1),nIntervals,Math.log);
}

/*
fast log, fallback to native log for large value, using inversion for small values
*/
FastFun.prototype.log=function(x){
	var index;
    var ln=0;
	if (x<1){
        return -this.log(1/x);
    }
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
    x=this.tabFactor*(x-1);
    index=Math.floor(x);
    x-=index;
    return ln+this.table[index]*(1-x)+this.table[index+1]*x;
}