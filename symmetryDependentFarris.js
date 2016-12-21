"use strict";


// setting symmetry dependent map dimensions as function of period dimensions
// =====================================================================
function setMapDimensions(){
	mapWidth=periodWidth/2;
	mapHeight=periodHeight/2;
	mapWidth=periodWidth;
	mapHeight=periodHeight;
}

//for debugging: show the basic map on output as red lines
//================================================================
function showHintPatch(){
	if (hintPatch&&inputLoaded){
		outputImage.strokeStyle="Red";	
		outputImage.strokeRect(outputOffsetX,outputOffsetY,mapWidth,mapHeight);
	}
}



//  a "symmetric" map for the primitive map !!!
// ========================================================================
//  trivial map for simple maping



function trivialMapTable(){
	var locmapWidth=mapWidth;
	var locmapHeight=mapHeight;
	var locmapWidth2=mapWidth/2;
	var locmapHeight2=mapHeight/2;
	var index=0;
	var i,j;
	for (j=0;j<locmapHeight;j++){
		for (i=0;i<locmapWidth;i++){
			mapXTab[index]=i-locmapWidth2;
			mapYTab[index++]=j-locmapHeight2;		
		}
	}	
}

function setupMapTables(){
	trivialMapTable();
}

// the replacement color for outside pixels
var outsideRed=0;
var outsideGreen=0;
var outsideBlue=200;

// presetting special symmetries, fixing the height to width ratio of the unit cell
function setSymmetries(){
	squareSymmetry=false;
	hexagonSymmetry=true;
}

// draw the unit cell on output image
// the shape of the basic map and symmetries in unit cell depend on symmetry of the image
//=================================================================================
function makeSymmetriesFarris(){
	// draw the basic map, using the mapping in the map tables 
	for (var j=0;j<mapHeight;j++){
		drawPixelLine(0,mapWidth-1,j);
	}
	// the symmetries inside the unit cell
	//verticalMirror(periodHeight/2);
	//horizontalMirror(periodWidth);
		//threeFoldRotational();
		sixFoldRotational();

}

// six-fold and threefold rotational symmetries