"use strict";

// we need this for simple patching

// the colors, directly for speed
var outputRed;
var outputBlue;
var outputGreen;

// get a output pixel color values for noninteger coordinates
// in the unit cell
//  need a good result for all values
// clamp coordinates at boundary
//  linear interpolation should be good enough (no magnification of pixels)


// copy a line of pixels on ouput pixels, source may be at any angle
function copyPixelSkewed(targetI,targetEndI,targetJ,
					sourceI,sourceJ,sourceStepI,sourceStepJ){
	var h,k;
	var dx,dy;
	var i00,i01,i10,i11;
	var f00,f01,f10,f11;
	var iPix=outputPixels;
	var locPeriodWidth=periodWidth;
	var periodWidth4=4*periodWidth;
						
	var target=index(targetI,targetJ);
	var targetEnd=index(targetEndI,targetJ)+3;        // all pixel components
	while (target<=targetEnd) {  // do complete pixels ...
					
	k=Math.floor(sourceJ);
	dy=sourceJ-k;
	if (k<0){   // out of the bottom
		i00=0;
		i10=0;
	}
	else if (k>=periodHeight-1){   // out of top
		i00=4*periodWidth*(periodHeight-1);
		i10=i00;
	}
	else {
		i00=4*periodWidth*k;
		i10=i00+4*periodWidth;
	}
	h=Math.floor(sourceI);
	dx=sourceI-h;	
	if (h<0){	// out left
		i01=i00;
		i11=i10;
	}
	else if (h>=periodWidth-1){    // out right
		i00+=4*(periodWidth-1);
		i01=i00;
		i10+=4*(periodWidth-1);
		i11=i10;
	}
	else {
		i00+=4*h;
		i01=i00+4;
		i10+=4*h;
		i11=i10+4;
	}
	// now all index points are inside
	// same calculation for all cases
	f00=(1-dy)*(1-dx);
	f01=(1-dy)*dx;
	f10=dy*(1-dx);
	f11=dy*dx;
	iPix[target++]=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
	iPix[target++]=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
	iPix[target]=f00*iPix[i00]+f10*iPix[i10]+f01*iPix[i01]+f11*iPix[i11];	
	target+=2;
	sourceI+=sourceStepI;
	sourceJ+=sourceStepJ;
	}	
}				

function getOutputColor(x,y){
	var h,k;
	var dx,dy;
	var i00,i01,i10,i11;
	var iPix=outputPixels;
	k=Math.floor(y);
	dy=y-k;
	if (k<0){   // out of the bottom
		i00=0;
		i10=0;
	}
	else if (k>=periodHeight-1){   // out of top
		i00=4*periodWidth*(periodHeight-1);
		i10=i00;
	}
	else {
		i00=4*periodWidth*k;
		i10=i00+4*periodWidth;
	}
	h=Math.floor(x);
	dx=x-h;	
	if (h<0){	// out left
		i01=i00;
		i11=i10;
	}
	else if (h>=periodWidth-1){    // out right
		i00+=4*(periodWidth-1);
		i01=i00;
		i10+=4*(periodWidth-1);
		i11=i10;
	}
	else {
		i00+=4*h;
		i01=i00+4;
		i10+=4*h;
		i11=i10+4;
	}
	console.log(i00+" "+i01+" "+i10+" "+i11);
	// now all index points are inside
	// same calculation for all
	var f00=(1-dy)*(1-dx);
	var f01=(1-dy)*dx;
	var f10=dy*(1-dx);
	var f11=dy*dx;
	outputRed=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
	outputGreen=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
	outputBlue=f00*iPix[i00]+f10*iPix[i10]+f01*iPix[i01]+f11*iPix[i11];				
}
