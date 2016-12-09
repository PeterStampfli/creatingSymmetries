"use strict";

// setting symmetry dependent patch dimensions as function of period dimensions
// =====================================================================
function setPatchDimensions(){
	patchWidth=periodWidth/2;
	patchHeight=periodHeight/2;
}

//for debugging: show the basic patch on output as red lines
//================================================================
function showHintPatch(){
	outputImage.strokeStyle="Red";	
	outputImage.strokeRect(0,0,patchWidth,patchHeight);
}

