"use strict";


// copy a line of pixels on output pixels, source may be at any angle
function copyPixelSkewed(targetI,targetEndI,targetJ,
					sourceI,sourceJ,sourceStepI,sourceStepJ){
	var target=index(targetI,targetJ);
	var targetEnd=index(targetEndI,targetJ);        
	while (target<=targetEnd) {  
		copyPixLinear(sourceI,sourceJ,outputData,target,outputData);
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
		copyPixLinear(sourceI,sourceJ,outputData,target,outputData);
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
