"use strict";

// get a simple pixel index from indices (i,j) to pixels in the unit cell
//  is index to the red component of the pixel, green,blue and alpha follow
//  round the values to get integer pixels !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//=============================================================================
function index(i,j){
	return 4*(Math.round(i)+periodWidth*Math.round(j));
}

// copy pixel values, only RGB part
// target goes upwards on a horizontal line from (targetI,targetJ) to (targetEndI,targetJ)
// source starts at (sourceI,sourceJ) and makes steps (sourceStepI,sourceStepJ)
//  starting points: from=(fromI,fromJ) and to=(toI,toJ)
//  accounts for (output canvas) width and 4 bytes per pixels, skipping alpha
//===================================================================================
function copyPixels(targetI,targetEndI,targetJ,
					sourceI,sourceJ,sourceStepI,sourceStepJ){
	var target=index(targetI,targetJ);
	var targetEnd=index(targetEndI,targetJ);        
	var source=index(sourceI,sourceJ);
	var sourceStep=index(sourceStepI,sourceStepJ)-2;  // with compensation for pixel subcomponents 
	while (target<=targetEnd) {  // do complete pixels ...
		outputPixels[target++]=outputPixels[source++];
		outputPixels[target++]=outputPixels[source++];
		outputPixels[target]=outputPixels[source];
		target+=2;                                       // ... skip alpha
		source+=sourceStep;                             // walk the source
	}
}


// same, but from right to left, decreasing x-values
//  targetI>targetEndI
function copyPixelsRightToLeft(targetI,targetEndI,targetJ,
					sourceI,sourceJ,sourceStepI,sourceStepJ){
	var target=index(targetI,targetJ);
	var targetEnd=index(targetEndI,targetJ);       
	var source=index(sourceI,sourceJ);
	var sourceStep=index(sourceStepI,sourceStepJ)-2;  // with compensation for pixel subcomponents 
	while (target>=targetEnd) {  // do complete pixels ...
		outputPixels[target++]=outputPixels[source++];
		outputPixels[target++]=outputPixels[source++];
		outputPixels[target]=outputPixels[source];
		target-=6;                                       // ... skip alpha
		source+=sourceStep;                             // walk the source
	}
}


//  copy a rectangular piece, same orientation, only other place
//  inside the unit cell
function copyRectangle(targetX,targetY,sourceX,sourceY,width,height){
	var targetYEnd=targetY+height;
	var targetEnd;
	var target;
	var source;
	while (targetY<targetYEnd){
		target=index(targetX,targetY);
		source=index(sourceX,sourceY);
		targetY++;
		sourceY++;
		targetEnd=target+4*width;
		while (target<targetEnd){
			outputPixels[target++]=outputPixels[source++];
			outputPixels[target++]=outputPixels[source++];
			outputPixels[target]=outputPixels[source];
			target+=2;
			source+=2;
		}
	}
}

// and now the special symmetries, that can be done exactly pixel for pixel
//==========================================================================
// mirrorsymmetry in the unit cell at a horizontal axis
//  overwrites upper half
// lying at periodicHeight/2 with variable length (number of pixels)
//  reasonable values are periodicLength or periodicLength/2
function horizontalMirror(length){
	for (var fromJ=0;fromJ<periodHeight/2;fromJ++){
		copyPixels(0,length-1,periodHeight-fromJ-1,
					0,fromJ,1,0);
	}
}

// mirror symmetry in the unit cell at a vertical axis
// lying at periodicWidth/2, with variable length (number of pixels)
//  overwrites right side
//  reasonable values are periodicLength and periodicLength/2
function verticalMirror(length){
	var periodWidth2=periodWidth/2;
	for (var fromJ=0;fromJ<length;fromJ++){
		copyPixels(periodWidth2,periodWidth-1,fromJ,
					periodWidth2-1,fromJ,-1,0);
	}
}

// quarter turn rotational symmetry around center of unit cell
// turns (numerical) lower right quarter 90 degrees counterclockwise
// to the upper right quarter, which is overwritten
function quarterTurn(){
	var period2=Math.min(periodWidth,periodHeight)/2;
	for (var j=0;j<period2;j++){
		copyPixels(0,period2-1,j+period2,
					period2-1-j,0,0,1);
	}
}

// half turn rotational symmetry around center of unit cell
// turns right half 180 degrees 
// to the right half, which is overwritten
function halfTurn(){
	var periodWidth2=periodWidth/2;
	for (var j=0;j<periodHeight;j++){
		copyPixels(periodWidth2,periodWidth-1,j,
					periodWidth2-1,periodWidth-1-j,-1,0);
	}
}

//  mirror at the upwards going diagonal x=y
//  take the sector i>j and overwrite j<i
// square lattice
//  length=period/2 typically (length=period ???)
function upDiagonalMirror(length){
	for (var j=0;j<length;j++){
		copyPixels(0,j-1,j,
					j,0,0,1);	
	}
}

// mirror at the down going diagonal x+y=period/2
//  take the sector x+y<length-1 and overwrite x+y>length-1
//  both in the lower right quarter
// square lattice
//  reasonable value length=perioWidth/2
function downDiagonalMirror(length){
	for (var j=0;j<length;j++){
		copyPixels(length-1-j,length-1,j,
					length-1-j,j,0,-1);	
	}
}

// copying the left half crosswise to the right
//  as needed for rhombic or hexagonal symmetry
function rhombicCopy(){
	copyRectangle(periodWidth/2,0,0,periodHeight/2,periodWidth/2,periodHeight/2);
	copyRectangle(periodWidth/2,periodHeight/2,0,0,periodWidth/2,periodHeight/2);
}

