"use strict";

//  manipulating the reference image (precision highlighting of sampled pixels)
//====================================================================
var referenceData;
var referencePixels;

// get pixels from reference canvas
function getPixelsFromReferenceCanvas(){
	referenceData = referenceImage.getImageData(0,0,referenceWidth,referenceHeight);
	referencePixels = referenceData.data;
}

// put pixels on reference canvas
function putPixelsOnReferenceCanvas(){
	referenceImage.putImageData(referenceData, 0, 0);
}

// fade-out all pixels by setting alpha
function setAlphaReferenceImagePixels(alpha){
	var theEnd=referencePixels.length;
	for (var i=3;i<theEnd;i+=4){
		referencePixels[i]=alpha;
	}
}

// drawing a line of pixels on the output image
//===========================================================0

function drawPixelLine(fromI,toI,j){
	// local variables for acceleration
	// quality
	var locQuality=quality;
	var locNEXT=NEXT;
	var locLINEAR=LINEAR;
	var locCUBIC=CUBIC;
	// center of sampling as defined by the mouse on the reference image
	var centerX=referenceCenterX/scaleInputToReference;
	var centerY=referenceCenterY/scaleInputToReference;
	var locScaleCos=scaleOutputToInput*cosAngle;
	var locScaleSin=scaleOutputToInput*sinAngle;
	// input image
	var locInputWidth=inputWidth;
	var locInputWidthM3=inputWidth-3;
	var locInputHeight=inputHeight;
	var locInputHeightM3=inputHeight-3;
	var iPix=inputPixels;
	//  (output) image
	var locOutputPixels=outputPixels;
	//  reference image
	var locReferencePixels=referencePixels;
	var locReferenceWidth=referenceWidth;
	var locReferenceHeight=referenceHeight;
	var locScaleInputToReference=scaleInputToReference;
	//  sampling coordinates
	var x,y,newX;
	//  integer part of sampling coordinates
	var h,k;
	var inputIndex;
	// resulting color components
	var red,green,blue;	
	var outputIndex=index(fromI,j);
	//  index to the mapping function table
	var mapIndex=fromI+patchWidth*j;
	var locMapXTab=mapXTab;
	var locMapYTab=mapYTab;
	for (var i=fromI;i<=toI;i++){
		// some "symmetric" mapping from (i,j) to (x,y) stored in a map table !!!
		x=locMapXTab[mapIndex];
		y=locMapYTab[mapIndex];
		// now going to the input image
		// center corresponds to (x,y)=(0,0)
		newX=locScaleCos*x-locScaleSin*y+centerX;
		y=locScaleSin*x+locScaleCos*y+centerY;
		x=newX;
		//  get the pixel color components, depending on quality
		if (locQuality==locNEXT){		
			// get nearest integer pixel coordinates
			h=Math.round(x);
			k=Math.round(y);
			// do blue pixels if outside boundaries
			if ((h<0)||(h>=locInputWidth)||
				(k<0)||(k>=locInputHeight)) {
				red=0;
				green=0;
				blue=255;
			}
			else {
				// index of base point
				inputIndex=4*(k*locInputWidth+h);
				// get nearest pixels
				red=iPix[inputIndex++];
				green=iPix[inputIndex++];
				blue=iPix[inputIndex];
			}
		}
		else {			
			// get integer part below sampling point
			h=Math.floor(x);
			k=Math.floor(y);
			// do blue pixels if outside boundaries
			if ((h<1)||(h>locInputWidthM3)||
				(k<1)||(k>locInputHeightM3)) {
				red=0;
				green=0;
				blue=255;
			}
			else {
				// index of base point
				inputIndex=4*(k*locInputWidth+h);
				if (locQuality==locLINEAR){		
					// 	
					var i00=inputIndex;
					var i01=i00+4;
					var i10=i00+4*locInputWidth;
					var i11=i10+4;
					var dx=x-h;
					var dy=y-k;
					var f00=(1-dy)*(1-dx);
					var f01=(1-dy)*dx;
					var f10=dy*(1-dx);
					var f11=dy*dx;
					red=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
					green=f00*iPix[i00++]+f10*iPix[i10++]+f01*iPix[i01++]+f11*iPix[i11++];
					blue=f00*iPix[i00]+f10*iPix[i10]+f01*iPix[i01]+f11*iPix[i11];			
				}
				else {  //CUBIC interpolation
					var kernel=mitchellNetrovalli;
					//  total indizes for varying height offset points
					var j0=inputIndex-4;
					var jm=j0-4*locInputWidth;
					var j1=j0+4*locInputWidth;
					var j2=j1+4*locInputWidth;
					// get separated kernel results for the different heights
					var dy=y-k;     //1 >= dy >= 0 thus kernel arguments 0<=x<=2
					var kym=kernel(1+dy);
					var ky0=kernel(dy);
					var ky1=kernel(1-dy);
					var ky2=kernel(2-dy);
					// sum up advancing in x-direction
					var dx=x-h;
					var kx=kernel(1+dx);
					red=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					green=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					blue=kx*(kym*iPix[jm]+ky0*iPix[j0]+ky1*iPix[j1]+ky2*iPix[j2]);
					jm+=2;
					j0+=2;
					j1+=2;
					j2+=2;
					var kx=kernel(dx);
					red+=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					green+=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					blue+=kx*(kym*iPix[jm]+ky0*iPix[j0]+ky1*iPix[j1]+ky2*iPix[j2]);
					jm+=2;
					j0+=2;
					j1+=2;
					j2+=2;
					var kx=kernel(1-dx);
					red+=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					green+=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					blue+=kx*(kym*iPix[jm]+ky0*iPix[j0]+ky1*iPix[j1]+ky2*iPix[j2]);
					jm+=2;
					j0+=2;
					j1+=2;
					j2+=2;
					var kx=kernel(2-dx);
					red+=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					green+=kx*(kym*iPix[jm++]+ky0*iPix[j0++]+ky1*iPix[j1++]+ky2*iPix[j2++]);
					blue+=kx*(kym*iPix[jm]+ky0*iPix[j0]+ky1*iPix[j1]+ky2*iPix[j2]);
					red=Math.max(0,Math.round(red));
					green=Math.max(0,Math.round(green));
					blue=Math.max(0,Math.round(blue));
				}
			}
		}
		//  write them on the image
		locOutputPixels[outputIndex++]=red;
		locOutputPixels[outputIndex++]=green;
		locOutputPixels[outputIndex]=blue;
		outputIndex+=2;    //skip alpha
		// mark the reference image pixel
		h=Math.round(locScaleInputToReference*h);
		k=Math.round(locScaleInputToReference*k);
		if ((h>=0)&&(h<locReferenceWidth)&&(k>=0)&&(k<locReferenceHeight)){
			locReferencePixels[4*(locReferenceWidth*k+h)+3]=255;
		}
		// update the index to the mapping function table
		mapIndex++;
	}
}

//  make the symmetries, draw the full output image
//==========================================================
function farrisDrawing(){
	if (!inputLoaded){						// no input means nothing to do
		return;
	}
	// white out: make the reference image semitransparent
	setAlphaReferenceImagePixels(128);
	// make the symmetries on the output image, reuse and overwrite pixels
	//  make scanned pixels fully opaque on reference image
	//===========================================================
	makeSymmetriesFarris();
	//===========================================================
	// put the symmetric image on the output canvas
	putPixelsPeriodicallyOnCanvas();
	// put the reference image
	putPixelsOnReferenceCanvas();
	// hint for debugging
	showHintPatch();
}


