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
		copyPixelSkewed(0,0.3333*j*periodWidth/periodHeight,periodHeight-1-j,
					0.5*j*periodWidth/periodHeight,0.5*j,-0.5,1.5*periodHeight/periodWidth);
		
	}
		// the lower half-triangle at the right border

	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewed(0,0.3333*j*periodWidth/periodHeight,j,
					0.5*j*periodWidth/periodHeight,0.5*j,0.5,-1.5*periodHeight/periodWidth)
		
	}
	// the upper equilateral triangle at left
	//  
	for (j=0;j<periodHeight/2;j++){
		copyPixelSkewed(Math.floor(j*0.3333*periodWidth/periodHeight),0.3333*periodWidth*(1-j/periodHeight),periodHeight-1-j,
					j,0,0.5,1.5*periodHeight/periodWidth);
		
	}
	// local inversion symmetry at (periodWidth/4,periodHeight/4)
	for (j=0;j<periodHeight/2;j++){
		copyPixels(Math.round(0.3333*periodWidth*(1-j/periodHeight)),periodWidth/2-1,j,
					Math.round(0.3333*periodWidth*(0.5+j/periodHeight)),periodHeight/2-1-j,-1,0);

	}
	// local inversion symmetry at (periodWidth/4,periodHeight*3/4)
	for (j=0;j<periodHeight/2;j++){
		copyPixels(Math.round(0.3333*periodWidth*(1-j/periodHeight)),periodWidth/2-1,periodHeight-1-j,
					Math.round(0.3333*periodWidth*(0.5+j/periodHeight)),periodHeight/2+j,-1,0);

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
	var x;
	// lower right triangle
	for (j=0;j<periodHeight/2;j++){
		x=Math.round(0.3333*periodWidth*(1+j/periodHeight));
		copyPixelSkewed(x,0.5*periodWidth-1,j,
					x,periodHeight-1-j,-0.5,-1.5*periodHeight/periodWidth);
		
	}
	// upper right triangle
	for (j=0;j<periodHeight/2;j++){
		x=math.round(0.3333*periodWidth*(0.5-j/periodHeight));
		copyPixelSkewed(0.5*periodWidth-1-x,0.5*periodWidth-1,periodHeight-1-j,
					0.25*periodWidth+0.5*x,j,-0.5,1.5*periodHeight/periodWidth);
		
	}


}
