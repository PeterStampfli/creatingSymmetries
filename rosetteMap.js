"use strict";

	
/*
class: CNumber
*/
function CNumber(re,im) {
    this.re = re;
    this.im = im;
}

//  create a new complex zero without "new"
function cZero() {
    return new CNumber(0,0);
}

//  create a new cNumber without "new"
function cNumber(re,im) {
    return new CNumber(re,im);
}

// this CNumber=this CNumber * that CNumber
CNumber.prototype.mult = function (that) {
    var h = that.re * this.re - that.im * this.im;
    this.im = that.im * this.re + that.re * this.im;
    this.re = h;
    return this;
};

// this CNumber=that1 CNumber*that2 CNumber
CNumber.prototype.prod = function (that1, that2) {
    this.re = that1.re * that2.re - that1.im * that2.im;
    this.im = that1.re * that2.im + that1.im * that2.re;
    return this;
}

// this CNumber=this + that1 CNumber*that2 CNumber
CNumber.prototype.addProd = function (that1, that2) {
    this.re += that1.re * that2.re - that1.im * that2.im;
    this.im += that1.re * that2.im + that1.im * that2.re;
    return this;
}

// this cNumber=this CNumber* complex conjugate of that CNumber
CNumber.prototype.multConj = function (that) {
    var h = that.re * this.re + that.im * this.im;
    this.im = that.re * this.im - that.im * this.re;
    this.re = h;
    return this;
};

// this CNumber=that1 CNumber*complex conjugate of that2 CNumber
CNumber.prototype.prodConj = function (that1, that2) {
    this.re = that1.re * that2.re + that1.im * that2.im;
    this.im = that.re * this.im - that.im * this.re;
    return this;
}

// this CNumber=this + that1 CNumber*complex conjugate of that2 CNumber
CNumber.prototype.addProdConj = function (that1, that2) {
    this.re += that1.re * that2.re + that1.im * that2.im;
    this.im += that.re * this.im - that.im * this.re;
    return this;
}

// this cNumber= this cNumber / that cNumber
CNumber.prototype.div = function (that) {
    var d = 1.0 / (that.re * that.re + that.im * that.im + 0.0000001);
    var h = d * (that.re * this.re + that.im * this.im);
    this.im = d * (that.re * this.im - that.im * this.re);
    this.re = h;
    return this;
}

// this cNumber= that1 cNumber / that2 cNumber
CNumber.prototype.quotient = function (that1, that2) {
    var d = 1.0 / (that2.re * that2.re + that2.im * that2.im + 1e-40);
    this.re = d * (that1.re * that2.re + that2.im * that2.im);
    this.im = d * (that1.re * that2.im - that1.im * that2.re);
    return this;
}

// this cNumber= trhis + that1 cNumber / that2 cNumber
CNumber.prototype.addQuotient = function (that1, that2) {
    var d = 1.0 / (that2.re * that2.re + that2.im * that2.im + 1e-40);
    this.re += d * (that1.re * that2.re + that2.im * that2.im);
    this.im += d * (that1.re * that2.im - that1.im * that2.re);
    return this;
}

// this cNumber= this cNumber / conjugate of that cNumber
CNumber.prototype.divConj = function (that) {
    var d = 1.0 / (that.re * that.re + that.im * that.im + 0.0000001);
    var h = d * (that.re * this.re - that.im * this.im);
    this.im = d * (that.re * this.im + that.im * this.re);
    this.re = h;
    return this;
}

// this cNumber= that1 cNumber / conjugate of that2 cNumber
CNumber.prototype.quotientConj = function (that1, that2) {
    var d = 1.0 / (that2.re * that2.re + that2.im * that2.im + 0.0000001);
    this.re = d * (that1.re * that2.re - that2.im * that2.im);
    this.im = d * (that1.re * that2.im + that1.im * that2.re);
    return this;
}

// this cNumber= this + that1 cNumber / conjugate of that2 cNumber
CNumber.prototype.addQuotientConj = function (that1, that2) {
    var d = 1.0 / (that2.re * that2.re + that2.im * that2.im + 0.0000001);
    this.re += d * (that1.re * that2.re - that2.im * that2.im);
    this.im += d * (that1.re * that2.im + that1.im * that2.re);
    return this;
}



CNumber.prototype.toString = function () {
    return "(" + this.re + " + i * " + this.im + ")";
}



// ========================================================================
function rosetteMapTables() {
    var mapSize = mapWidth;
    var locmapHeight = mapHeight;
    var radius = mapWidth / 2;
    var inputSize=200;
    var index = 0;
    var i, j;
    // create complex numbers
    var zBase=cZero();
    var zBase2=cZero();
    var r=cZero();
    r.re=0.1;
    for (j = 0; j < mapSize; j++) {
        for (i = 0; i < mapSize; i++) {
        	// normalize to be independent of output size
        	zBase.re=i/radius-1;
        	zBase.im=j/radius-1;
        	zBase.mult(zBase);
        	zBase.mult(zBase);
        	zBase2.quotient(r,zBase);
    //    	zBase.re+=zBase2.re;
     //   	zBase.im+=zBase2.im;
     zBase.addProd(zBase,zBase);
        	//  scale to typical input size
            mapXTab[index] = inputSize*zBase.re;
            mapYTab[index++] = inputSize*zBase.im;
        }
    }
}