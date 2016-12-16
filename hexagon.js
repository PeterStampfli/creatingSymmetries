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

// set pixel at targetindex position from (sourceI,sourceJ) with linear interpolation

function setOutputPixel(targetIndex,x,y){
	//copyPixNearest(x,y,outputPixels,targetIndex,outputPixels,periodWidth,periodHeight);
	copyPixLinear(x,y,outputPixels,targetIndex,outputPixels,periodWidth,periodHeight);
}


function setOutputPixelWWWWWW(targetIndex,sourceI,sourceJ){
	var h,k,h0,k0,h1,k1;
	var dx,dy;
	var i00,i01,i10,i11;
	var f00,f01,f10,f11;
	var iPix=outputPixels;
	var locPeriodWidth=periodWidth;
	var periodWidth4=4*periodWidth;
	k=Math.floor(sourceJ);
	dy=sourceJ-k;
	if (k<0){   // out of the bottom
		k0=0;
		k1=0;
	}
	else if (k>=periodHeight-1){   // out of top
		k0=4*periodWidth*(periodHeight-1);
		k1=k0;
	}
	else {
		k0=4*periodWidth*k;
		k1=k0+4*periodWidth;
	}
	h=Math.floor(sourceI);
	dx=sourceI-h;	
	if (h<0){	// out left
		h0=0;
		h1=0;
	}
	else if (h>=periodWidth-1){    // out right
		h0=4*(periodWidth-1);
		h1=h0;
	}
	else {
		h0=4*h;
		h1=h0+4;
	}
	i00=h0+k0;
	i01=h0+k1;
	i10=h1+k0;
	i11=h1+k1;
	// now all index points are inside
	// same calculation for all cases
	f00=(1-dx)*(1-dy);
	f01=(1-dx)*dy;
	f10=dx*(1-dy);
	f11=dy*dx;
	iPix[targetIndex++]=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
	iPix[targetIndex++]=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
	iPix[targetIndex]=f00*iPix[i00]+f10*iPix[i10]+f01*iPix[i01]+f11*iPix[i11];	
}

// copy a line of pixels on ouput pixels, source may be at any angle
function copyPixelSkewed(targetI,targetEndI,targetJ,
					sourceI,sourceJ,sourceStepI,sourceStepJ){
	var target=index(targetI,targetJ);
	var targetEnd=index(targetEndI,targetJ);        
	while (target<=targetEnd) {  
		setOutputPixel(target,sourceI,sourceJ);
		target+=4;
		sourceI+=sourceStepI;
		sourceJ+=sourceStepJ;
	}	
}

// copy a line of pixels on ouput pixels, source may be at any angle
//   going from target right to left 
function copyPixelSkewedRightToLeft(targetI,targetEndI,targetJ,
					sourceI,sourceJ,sourceStepI,sourceStepJ){
	var target=index(targetI,targetJ);
	var targetEnd=index(targetEndI,targetJ);        // all pixel components
	while (target>=targetEnd) {  
		setOutputPixel(target,sourceI,sourceJ);
		target-=4;
		sourceI+=sourceStepI;
		sourceJ+=sourceStepJ;
	}	
}				

//  p6symmetry: sixFold rotational symmetry
function sixFoldRotational(){
	
	var j;
	//copyPixelSkewed(targetI,targetEndI,targetJ,
	//				sourceI,sourceJ,sourceStepI,sourceStepJ)
	
	//copyPixels(targetI,targetEndI,targetJ,
	//				sourceI,sourceJ,sourceStepI,sourceStepJ){
	
	// the upper half-tringle at the right border with corners
	//(0,periodHeight-1),(0,periodHeight/2),(periodWidth/6,periodHeight)
	// getting data from triangle with corners
	//(0,0),(periodWidth/4,periodHeight/4),(periodWidth/6,periodHeight/2-1)
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewed(0,0.3333*periodWidth*(0.5-j/periodHeight),periodHeight/2+j,
					0.5*periodWidth*(0.5-j/periodHeight),0.5*(periodHeight/2-1-j),-0.5,1.5*periodHeight/periodWidth);		
	}
	// the lower half-triangle at the right border

	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewed(0,0.3333*periodWidth*j/periodHeight,j,
					0.5*j*periodWidth/periodHeight,0.5*j,0.5,-1.5*periodHeight/periodWidth)	
	}
	// the upper equilateral triangle at left,right half
	//  
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewed(0.16666*periodWidth,0.3333*periodWidth*(0.5+j/periodHeight),periodHeight/2+j,
					periodWidth*(0.3333-0.5*j/periodHeight),0.5*j,0.5,1.5*periodHeight/periodWidth);		
	}
	// the upper equilateral triangle at left,left half
	//  
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewedRightToLeft(0.16666*periodWidth,0.3333*periodWidth*(0.5-j/periodHeight),periodHeight/2+j,
					periodWidth*(0.3333-0.5*j/periodHeight),0.5*j,-0.5,-1.5*periodHeight/periodWidth);	
	}
	// local inversion symmetry at (periodWidth/4,periodHeight/4)
	for (j=0;j<periodHeight/2;j++){
		copyPixelsRightToLeft(periodWidth/2-1,0.3333*periodWidth*(1-j/periodHeight),j,
					               0,periodHeight/2-1-j,1,0);

	}
	// local inversion symmetry at (periodWidth/4,periodHeight*3/4)
	for (j=0;j<periodHeight/2;j++){
		copyPixelsRightToLeft(periodWidth/2-1,0.3333*periodWidth*(0.5+j/periodHeight),periodHeight/2+j,
					          0,periodHeight-1-j,1,0);
	}
	
	rhombicCopy();
}

//  p3symmetry: threeFold rotational symmetry
function threeFoldRotational(){
	
	var j;
	//copyPixelSkewed(targetI,targetEndI,targetJ,
	//				sourceI,sourceJ,sourceStepI,sourceStepJ)
	
	//copyPixels(targetI,targetEndI,targetJ,
	//				sourceI,sourceJ,sourceStepI,sourceStepJ){
	
	// the upper half-tringle at the right border with corners
	//(0,periodHeight-1),(0,periodHeight/2),(periodWidth/6,periodHeight)
	// getting data from triangle with corners
	//(0,0),(periodWidth/4,periodHeight/4),(periodWidth/6,periodHeight/2-1)
	//lower left trapeze
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewed(0,0.3333*periodWidth*(1-j/periodHeight),j,
		                0.5*periodWidth-0.5*j/periodHeight*periodWidth,0.5*periodHeight-0.5*j,-0.5,1.5*periodHeight/periodWidth);
	}
	// upper left trapeze
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewed(0,0.3333*periodWidth*(0.5+j/periodHeight),periodHeight/2+j,
		                0.25*periodWidth+0.5*j/periodHeight*periodWidth,0.75*periodHeight-0.5*j,-0.5,-1.5*periodHeight/periodWidth);
	}
		// lower right triangle
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewedRightToLeft(periodWidth/2-1,0.3333*periodWidth*(1+j/periodHeight),j,
					0.5*periodWidth*(0.5+j/periodHeight),0.75*periodHeight-0.5*j,0.5,1.5*periodHeight/periodWidth);

	}
	// upper right triangle
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewedRightToLeft(periodWidth/2-1,periodWidth/2-1-0.3333*j*periodWidth/periodHeight,periodHeight/2+j,
					0.5*periodWidth-0.5*j/periodHeight*periodWidth,0.5*periodHeight-0.5*j,0.5,-1.5*periodHeight/periodWidth);

	}

	rhombicCopy();

}
