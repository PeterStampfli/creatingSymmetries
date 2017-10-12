"use strict";

/*
approximating functions with linear table interpolation
*/

function FastFunction(){
	//periodic function (sine with higher harmonics)
	this.periodicTabFactor;
	this.periodicTable=[];
	this.nPeriodicIntervalsM1;
	// the exponential function
	this.expMaxArgument=Math.floor(Math.log(Number.MAX_VALUE))+1;
	this.expMinArgument=Math.floor(Math.log(Number.MIN_VALUE));
	this.expTabIntPartMaxIndex=this.expMaxArgument-this.expMinArgument;
	this.expTabIntPart=[];
	this.expTabFracFactor;
	this.expTabFracPart=[];
	// the log function
	this.logTabFactor;
	this.logTable=[];
	// the atan function
	this.atanTabFactor;
	this.atanTable=[];
}

/*
make the table, length is number of intervalls plus 2 for interpolation and data at end of interval
*/
FastFunction.prototype.makeTable=function(table,start,end,nIntervals,theFunction){
	var step=(end-start)/nIntervals;
	var x=start;
	table.length=nIntervals+2;
	for (var i=0;i<nIntervals+2;i++){
		table[i]=theFunction(x);
		x+=step;
	}
}

/*
make a table for a periodic function with a power of 2 number of intervalls
period length is 2pi
*/
FastFunction.prototype.makePeriodicTable=function(log2NIntervals,theFunction){
	var nIntervals=Math.round(Math.pow(2,log2NIntervals));
	this.nPeriodicIntervalsM1=nIntervals-1;
	this.periodicTabFactor=nIntervals/2/Math.PI;
	this.makeTable(this.periodicTable,0,2*Math.PI,nIntervals,theFunction);
}

/*
interpolate periodic function directly
assuming that table is a sine-like function you get this sine-like function
*/
FastFunction.prototype.sinLike=function(x){
	var index;
	x*=this.periodicTabFactor;
	index=Math.floor(x);
	x-=index;
	index=index&this.nPeriodicIntervalsM1;
	return this.periodicTable[index++]*(1-x)+this.periodicTable[index]*x;
}

/*
interpolate periodic function with a shift by pi/2
assuming that table is a sine-like function you get this cos-like function
*/
FastFunction.prototype.cosLike=function(x){
	var index;
	x=this.periodicTabFactor*(x+1.570796);                            //pi/2
	index=Math.floor(x);
	x-=index;
	index=index&this.nPeriodicIntervalsM1;
	return this.periodicTable[index++]*(1-x)+this.periodicTable[index]*x;
}

/*
setup table for exponential function
*/
FastFunction.prototype.makeExpTable=function(nIntervals){
	this.makeTable(this.expTabIntPart,this.expMinArgument,this.expMaxArgument,
		this.expTabIntPartMaxIndex,Math.exp);	
	this.expTabFracFactor=nIntervals;
	this.makeTable(this.expTabFracPart,0,1,nIntervals,Math.exp);
}

/*
the exponential function
(seems to be faster in forefox, but not in chrome)
*/
FastFunction.prototype.exp=function(x){
	var indexToIntPart,indexToFractPart;
	indexToIntPart=Math.floor(x);
	x=this.expTabFracFactor*(x-indexToIntPart);
	indexToFractPart=Math.floor(x);
	x-=indexToFractPart;
	return this.expTabIntPart[Math.max(0,Math.min(this.expTabIntPartMaxIndex,indexToIntPart-this.expMinArgument))]*
	       (this.expTabFracPart[indexToFractPart++]*(1-x)+this.expTabFracPart[indexToFractPart]*x);
}	

/*
setup table for log function: values between 1 and e
*/
FastFunction.prototype.makeLogTable=function(nIntervals){
	this.logTabFactor=nIntervals/(Math.exp(1)-1);
	this.makeTable(this.logTable,1,Math.exp(1),nIntervals,Math.log);
}

/*
fast log, fallback to native log for large value, using inversion for small values
slower than native log for chrome, twice times faster for firefox
*/
FastFunction.prototype.log=function(x){
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
    x=this.logTabFactor*(x-1);
    index=Math.floor(x);
    x-=index;
    return ln+this.logTable[index]*(1-x)+this.logTable[index+1]*x;
}

/*
make the table for the atan function
*/
FastFunction.prototype.makeAtanTable=function(nIntervals){
	this.atanTabFactor=nIntervals;
	this.makeTable(this.atanTable,0,1,nIntervals,Math.atan);
}

/*
fast atan function
*/

/*
fast atan2
*/

FastFunction.prototype.atan2= function(y,x){
    var index;
    if (x>=0){
        if (y>0) {
            if (x>y) {
                x=this.atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return this.atanTable[index]*(1-x)+this.atanTable[index+1]*x;
            }
            else {
                x=this.atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return 1.5707963268-(this.atanTable[index]*(1-x)+this.atanTable[index+1]*x);
            }
        }
        else {
            if (x>-y){
                x=-this.atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return -(this.atanTable[index]*(1-x)+this.atanTable[index+1]*x);
            }
            else {
                x=-this.atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return -1.5707963268+this.atanTable[index]*(1-x)+this.atanTable[index+1]*x;
            }
        }
    }
    else {
        if (y>=0){
            if (x<-y){
                x=-this.atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return 3.1415926536-(this.atanTable[index]*(1-x)+this.atanTable[index+1]*x);
            }
            else {
                x=-this.atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return 1.5707963268+this.atanTable[index]*(1-x)+this.atanTable[index+1]*x;
            }
        }
        else {
            if (x<y){
                x=this.atanTabFactor*y/x;
                index=Math.floor(x);
                x-=index;
                return -3.1415926536+this.atanTable[index]*(1-x)+this.atanTable[index+1]*x;
            }
            else {
                x=this.atanTabFactor*x/y;
                index=Math.floor(x);
                x-=index;
                return -1.5707963268-(this.atanTable[index]*(1-x)+this.atanTable[index+1]*x);
            }
        }
    }
}

/*
creating periodic tables
*/
/*
for the simple sine and cosine
*/
FastFunction.prototype.makeSinTable=function(){
	this.makePeriodicTable(12,Math.sin);
}

/*
the triangle function, scaled to match the sine expansion
*/
FastFunction.prototype.triangle=function(x){
	var factor=0.25*Math.PI;
	if (x<0.5*Math.PI){
		return factor*x;
	}
	else if (x<1.5*Math.PI){
		return factor*(Math.PI-x);
	}
	else {
		return factor*(x-2*Math.PI);
	}
}

/*
make periodic table with the triangle function
*/
FastFunction.prototype.makeTriangleTable=function(){
	this.makePeriodicTable(4,this.triangle);
}

/*
fourier expansion of the triangle function
*/
FastFunction.prototype.triangleExpansion=function(n,x){
	var sign=1;
	var sum=0;
	var tIP1;
	for (var i=0;i<n;i++){
		tIP1=2*i+1;
		sum+=sign*Math.sin(tIP1*x)/tIP1/tIP1;
		sign=-sign;
	}
	return sum;
}

/*
make periodic table with the fourier expansion of the triangle function
*/
FastFunction.prototype.makeTriangleExpansionTable=function(nHarmonics){
	var fastFun=this;
	this.makePeriodicTable(12,function(x){
		return fastFun.triangleExpansion(nHarmonics,x);
	})
}

/*
make all the tables except the periodic table
with suitable lengths (test!)
returns the object, for chaining with creator
periodic function is simple sine
*/
FastFunction.prototype.makeExpLogAtanTables=function(){
	this.makeExpTable(1000);
	this.makeLogTable(1000);
	this.makeAtanTable(1000);
	return this;
}