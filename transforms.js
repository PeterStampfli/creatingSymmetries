"use strict";

// transformations before mapping to periodicity
//(x,y)==>(xT,yT)

var xT,yT;

// call in mapping.js before

//    xTimesUnitvectors(xT,yT);
//    imageZero();

// for logarithmic spirals

function logSpiral(x,y){
	xT=0.5*fLog(x*x+y*y);
	yT=fAtan2(y,x);
}

//rotate and scale, prepare factors

var rotXX,rotXY;

//  (0,1)=>(-rotXY,rotXX)

// prepare factors for (0,2PI)=>(periodX,periodY)

function prepareFactors2PI(periodX,periodY){
	rotXY=-periodX*0.5/Math.PI;
	rotXX=periodY*0.5/Math.PI;
}

function rotate(){
	var xx=rotXX*xT-rotXY*yT;
	yT=rotXY*xT+rotXX*yT;
	xT=xx;
}

