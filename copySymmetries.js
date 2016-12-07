// combine index to pixels from integer coordinates
// use only the periodic cell???????????????????????????????????????????????????????????
//  is index to the red component of the pixel, green,blue and alpha follow
function index(i,j){
	return 4*(i+periodWidth*j);
}

// copy pixel values, only RGB part
// target goes upwards on a horizontal line from (targetI,targetJ) to (targetEndI,targetJ)
// source starts at (sourceI,sourceJ) and makes steps (sourceStepI,sourceStepJ)
//  starting points: from=(fromI,fromJ) and to=(toI,toJ)
//  accounts for (output canvas) width and 4 bytes per pixels !!!
function copyPixels(targetI,targetEndI,targetJ,
					sourceI,sourceJ,sourceStepI,sourceStepJ){
	var target=index(targetI,targetJ);
	var targetEnd=index(targetEndI,targetJ)+3;        // all pixel components
	var source=index(sourceI,sourceJ);
	var sourceStep=index(sourceStepI,sourceStepJ)-3;  // with compensation for pixel subcomponents 
	while (target<=targetEnd) {  // do complete pixels ...
		outputPixels[target++]=outputPixels[source++];
		outputPixels[target++]=outputPixels[source++];
		outputPixels[target++]=outputPixels[source++];
		target++;                                       // ... skip alpha
		source+=sourceStep;                             // walk the source
	}
}

// mirrorsymmetry in the unit cell at a horizontal axis
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
//  reasonable values are periodicLength and periodicLength/2
function verticalMirror(length){
	var periodWidth2=periodWidth/2;
	for (var fromJ=0;fromJ<length;fromJ++){
		copyPixels(periodWidth2,periodWidth-1,fromJ,
					periodWidth2-1,fromJ,-1,0);
	}
}

