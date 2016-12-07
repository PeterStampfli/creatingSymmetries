
//  sampling quality
var NEXT=0;
var LINEAR=1;

var quality=NEXT;            // chooser ???

// draw a line of pixels on the output pixels
function drawPixelLine(fromI,toI,j){

	// local variables for acceleration
	// quality
	var locQuality=quality;
	var locNEXT=NEXT;
	var locLINEAR=LINEAR;
	// center of sampling as defined by the mouse on the reference image
	var centerX=mouseX/scaleInputToReference;
	var centerY=mouseY/scaleInputToReference;
	var locScale=scaleOutputToInput;
	// input image
	var locInputWidth=inputWidth;
	var locInputHeight=inputHeight;
	var locInputPixels=inputPixels;
	//  (output) image
	var locImagePixels=outputPixels;
	//  refernce image
	var locReferencePixels=referencePixels;
	var locReferenceWidth=referenceWidth;
	var locScaleInputToReferenceImage=scaleInputToReference;
	
	
	//  sampling coordinates
	var x,y;
	//  integer part of sampling coordinates
	var h,k;
	var inputIndex;
	// resulting color components
	var red,green,blue;
	
	var outputIndex=index(fromI,j);

	for (var i=fromI;i<=toI;i++){
		// some mapping from (i,j) to (x,y)
		// to define later, symmetry dependent
		// trivial default, equivalent to simple patching
		x=i;
		y=j;
		// now going to the input image
		// center correspopnds to (x,y)=(0,0)
		x=locScale*x+centerX;
		y=locScale*y+centerY;
		//  get the pixel color components
		if (locQuality==locNEXT){
			h=Math.max(0,Math.min(locInputWidth,Math.round(x)));
			k=Math.max(0,Math.min(locInputHeight,Math.round(y)));
			inputIndex=4*(k*locInputWidth+h);
			red=locInputPixels[inputIndex++];
			green=locInputPixels[inputIndex++];
			blue=locInputPixels[inputIndex];
		}
		//  write them on the image
		locImagePixels[outputIndex++]=red;
		locImagePixels[outputIndex++]=green;
		locImagePixels[outputIndex]=blue;
		outputIndex+=2;    //skip alpha
		// mark the reference image pixel
		h=Math.floor(locScaleInputToReferenceImage*h);
		k=Math.floor(locScaleInputToReferenceImage*k);
		locReferencePixels[4*(locReferenceWidth*k+h)+3]=255;

	}
	
}


// draw the output image on the output canvas 
function farrisDrawing(){
	outputCanvas.width=outputWidth;
	outputCanvas.height=outputHeight;
	outputImage.fillStyle="Blue";	
	outputImage.fillRect(0,0,outputWidth,outputHeight);
	setPatchDimensions();
	if (!inputLoaded){						// no input means nothing to do
		return;
	}
	// prepare the reference image
	// draw the entire input image and get the pixels
	referenceImage.drawImage(inputImage,0,0,inputWidth,inputHeight,
											  0,0,referenceWidth,referenceHeight);
	getPixelsFromReferenceCanvas();
	// white out, restore full transparency to scanned pixels
	setAlphaReferenceImagePixels(128);

	
		
	// now get the pixels of the periodic unit cell		
	getPixelsFromCanvas();
	
	drawPixelLine(0,patchWidth,0);

	
	
	// and make the symmetries
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
	// put the symmetric image on the output canvas
	putPixelsPeriodicallyOnCanvas();
	// put the reference image
	putPixelsOnReferenceCanvas();
	// hint for debugging
	showPatch();
}


