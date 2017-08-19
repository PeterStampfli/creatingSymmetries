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

// prepare rotation and scaling factors for square lattice,
//  for integer wavevectors and basic periodicity 2PI
// (0,2PI)=> (m*2PI,n*2PI)
function prepareFactorsSquareLattice(m,n){
	rotXY=-m;
	rotXX=n;
}


function rotate(){
	var xx=rotXX*xT-rotXY*yT;
	yT=rotXY*xT+rotXX*yT;
	xT=xx;
}

