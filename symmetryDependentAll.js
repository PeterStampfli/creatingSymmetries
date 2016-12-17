"use strict";

// setting symmetry dependent patch dimensions as function of period dimensions
// =====================================================================
function setPatchDimensions(){
	patchWidth=periodWidth/2;
	patchHeight=periodHeight/2;
	//patchWidth=periodWidth;
	//patchHeight=periodHeight;
}

//for debugging: show the basic patch on output as red lines
//================================================================
function showHintPatch(){
	if (hintPatch&&inputLoaded){
		outputImage.strokeStyle="Red";	
		outputImage.strokeRect(outputOffsetX,outputOffsetY,patchWidth,patchHeight);
	}
}

