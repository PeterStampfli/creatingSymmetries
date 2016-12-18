"use strict";

// for the mapping functions:
// tables for the sine and cosine functions
var sinXTab=[];
var sinYTab=[];

// making the tables, depending on the period lengths of the unit cell
// we need a full period to make lookup as simple as possible for higher frequencies
function setupSinTable(sinTab,length){
	var factor=2*Math.PI/length;
	var length4=length/4;
	var length2=length/2;
	var i;
	var sinus;
	sinTab.length=length;
	sinTab[0]=0;
	sinTab[length2]=0;
	for (i=1;i<=length4;i++){
		sinus=Math.sin(factor*i);
		sinTab[i]=sinus;
		sinTab[length2-i]=sinus;
		sinTab[length2+i]=-sinus;
		sinTab[length-i]=-sinus;	
	}	
}

// the sin and cos functions, periodic on the unit lattice dimensions,
//  for any integer multiple of the side length of a pixel
//====================================================
//  horizontal
function sinX(i){
	return sinXTab[i%periodWidth];
}

function cosX(i){
	return sinXTab[(i+periodWidth4)%periodWidth];
}

// vertical
function sinY(i){
	return sinYTab[i%periodHeight];
}

function cosY(i){
	return sinYTab[(i+periodHeight4)%periodHeight];
}


// drawing a line of pixels on the output image
//===========================================================0

function drawPixelLine(fromI,toI,j){
	// center of sampling as defined by the mouse on the reference image
	var centerX=referenceCenterX/scaleInputToReference;
	var centerY=referenceCenterY/scaleInputToReference;
	var scaleCos=scaleOutputToInput*cosAngle;
	var scaleSin=scaleOutputToInput*sinAngle;
	//  reference image, local variables
	var locReferencePixels=referencePixels;
	var locReferenceWidth=referenceWidth;
	var locReferenceHeight=referenceHeight;
	var locScaleInputToReference=scaleInputToReference;
	//  sampling coordinates
	var x,y,newX;
	//  integer part of reference coordinates
	var h,k;
	//  index to the output image pixel, initialization
	var outputIndex=index(fromI,j);
	//  the last
	var outputEnd=index(toI,j);
	//  index to the mapping function table, initialization
	var mapIndex=fromI+patchWidth*j;
	// local reference to the mapping table
	var locMapXTab=mapXTab;
	var locMapYTab=mapYTab;
	while (outputIndex<=outputEnd){
		// some "symmetric" mapping from (i,j) to (x,y) stored in a map table !!!
		x=locMapXTab[mapIndex];
		y=locMapYTab[mapIndex];
		// now going to the input image
		// center corresponds to (x,y)=(0,0)
		newX=scaleCos*x-scaleSin*y+centerX;
		y=scaleSin*x+scaleCos*y+centerY;
		x=newX;
		//  get the pixel color components, depending on quality
		copyInterpolation(x,y,outputData,outputIndex,inputData);
		outputIndex+=4;    //go to next output pixel (red component)	
		// mark the reference image pixel, make it fully opaque
		h=Math.round(locScaleInputToReference*x);
		k=Math.round(locScaleInputToReference*y);
		if ((h>=0)&&(h<locReferenceWidth)&&(k>=0)&&(k<locReferenceHeight)){
			locReferencePixels[4*(locReferenceWidth*k+h)+3]=255;
		}
		// update the index to the mapping function table
		mapIndex++;
	}
}

//  make the symmetries, draw the full output image
//==========================================================
function drawing(){
	if (!inputLoaded){						// no input means nothing to do
		return;
	}
	// white out: make the reference image semitransparent
	setAlphaReferenceImagePixels(128);
	// make the symmetries on the output image, reuse and overwrite pixels
	//  make scanned pixels fully opaque on reference image
	makeSymmetriesFarris();
	// put the symmetric image on the output canvas
	putPixelsPeriodicallyOnCanvas();
	// put the reference image
	putPixelsOnReferenceCanvas();
	// hint for debugging
	showHintPatch();
}


