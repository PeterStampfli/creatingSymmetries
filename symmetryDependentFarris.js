"use strict";

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
	var index=0;
	var i,j;
	for (j=0;j<patchHeight;j++){
		for (i=0;i<patchWidth;i++){
			mapXTab[index]=i;
			mapYTab[index++]=j;		
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
}
