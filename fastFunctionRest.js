"use strict";
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
	return this.periodicTable[index]*(1-x)+this.periodicTable[index+1]*x;
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
look up gauss for small args

note that exp(-4)=0.018, thus for image averaging exp(-x*x)==0 for x>2
*/
FastFunction.prototype.gauss=function(x){
    var index;
    if (x>=4){
        return 0;
    }
    x=this.gaussTabFactor*x;
    index=Math.floor(x);
    x-=index;
    return this.gaussTable[index]*(1-x)+this.gaussTable[index+1]*x;
}


/*
the triangle function, scaled to maximum value =1
*/
FastFunction.prototype.triangle=function(x){
	var factor=2/Math.PI;
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
normalized (Oscillating between -1 and 1)
*/
FastFunction.prototype.triangleExpansion=function(n,x){
	var sign=1;
	var sum=0;
	var tIP1;
    var maximum=0;
	for (var i=0;i<n;i++){
		tIP1=2*i+1;
		sum+=sign*Math.sin(tIP1*x)/tIP1/tIP1;
		sign=-sign;
        maximum+=1/tIP1/tIP1;
	}
	return sum/maximum;
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
periodic mapping: period length is 1, mapping the real axis to 0 to 1, 0 is mapped to 0
mirror symmetric around 0.5, using fourierexpansion of triangle function
*/
FastFunction.prototype.periodicMapping=function(x){
    return 0.5*(1-this.cosLike(6.28318*x));
}


// fast functions with elementary sin function
var elementaryFastFunction=new FastFunction();
// fast functions with fourier series for image
var imageFastFunction=new FastFunction();