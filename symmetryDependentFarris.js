"use strict";


// setting symmetry dependent patch dimensions as function of period dimensions
// =====================================================================
function setPatchDimensions(){
	patchWidth=periodWidth/2;
	patchHeight=periodHeight/2;
	patchWidth=periodWidth;
	patchHeight=periodHeight;
}

//for debugging: show the basic patch on output as red lines
//================================================================
function showHintPatch(){
	if (hintPatch&&inputLoaded){
		outputImage.strokeStyle="Red";	
		outputImage.strokeRect(outputOffsetX,outputOffsetY,patchWidth,patchHeight);
	}
}



// the table for the mapping function
var mapXTab=[];
var mapYTab=[];

//  a "symmetric" map for the primitive patch !!!
// ========================================================================
//  trivial map for simple patching


function setupMapTables(){
	var size=patchWidth*patchHeight;
	mapXTab.length=size;
	mapYTab.length=size;
	var locPatchWidth=patchWidth;
	var locPatchHeight=patchHeight;
	var locPatchWidth2=patchWidth/2;
	var locPatchHeight2=patchHeight/2;
	var patchScale=initialInputPatchWidth/locPatchWidth;
	var index=0;
	var i,j;
	for (j=0;j<locPatchHeight;j++){
		for (i=0;i<locPatchWidth;i++){
			mapXTab[index]=(i-locPatchWidth2)*patchScale;
			mapYTab[index++]=(j-locPatchHeight2)*patchScale;		
		}
	}	
}

// draw the unit cell on output image
// the shape of the basic patch and symmetries in unit cell depend on symmetry of the image
//=================================================================================
function makeSymmetriesFarris(){
	// draw the basic patch, using the mapping in the map tables 
	for (var j=0;j<patchHeight;j++){
		drawPixelLine(0,patchWidth-1,j);
	}
	// the symmetries inside the unit cell
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
	//	threeFoldRotational();

}
