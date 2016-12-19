"use strict";
	
// maximum size of reference image
var maxReferenceSize=300;
//  derived dimensions for the reference canvas
var referenceWidth;
var referenceHeight;
//  ratio of input image to reference image
var scaleInputToReference;

function setupReference(){
	// set up dimensions of the reference image
	var inputSize=Math.max(inputWidth,inputHeight);
	if (inputSize<maxReferenceSize){
		referenceWidth=inputWidth;
		referenceHeight=inputHeight;
	}
	else {
		referenceWidth=Math.round(inputWidth*maxReferenceSize/inputSize);
		referenceHeight=Math.round(inputHeight*maxReferenceSize/inputSize);			
	}
	referenceCanvas.width=referenceWidth;
	referenceCanvas.height=referenceHeight;
	// put center of readings to image center
	referenceCenterX=referenceWidth/2;
	referenceCenterY=referenceHeight/2;
	// get scale of mapping from input image to the reference image
	scaleInputToReference=Math.min(referenceWidth/inputWidth,
										referenceHeight/inputHeight);
											// prepare the reference image
	// reference image: draw the entire input image and get the pixels
	referenceImage.drawImage(inputImage,0,0,inputWidth,inputHeight,
											  0,0,referenceWidth,referenceHeight);
	getPixelsFromReferenceCanvas();

}


// interaction with the refernce canvas

// current mouse data, with respect to referenceCanvas
var referenceMousePressed=false;
var lastReferenceMouseX=0;
var lastReferenceMouseY=0;
var referenceMouseX=0;
var referenceMouseY=0;
//  center for sampling on reference canvas
var referenceCenterX=0;
var referenceCenterY=0;

//  set the mouse coordinates from current event
function setReferenceMousePosition(event){
	referenceMouseX=event.pageX-referenceCanvas.offsetLeft;
	referenceMouseY=event.pageY-referenceCanvas.offsetTop;
}

// the wheel changes the scale: map to input image pixels
//  a larger scale zooms out
var scaleOutputToInput=1;
var changeScaleFactor=1.1;

// make the patch range in image coordinates independent of the output size
// thats the effective input patch length for scaleOutputToInput=1
var initialInputPatchWidth=256;       


function referenceMouseDownHandler(event){
	stopEventPropagationAndDefaultAction(event);
	referenceMousePressed=true;
	setReferenceMousePosition(event);
	lastReferenceMouseX=referenceMouseX;
	lastReferenceMouseY=referenceMouseY;
	return false;
}

function referenceMouseMoveHandler(event){
	stopEventPropagationAndDefaultAction(event);
	if (referenceMousePressed){
		setReferenceMousePosition(event);
		referenceCenterX+=referenceMouseX-lastReferenceMouseX;
		referenceCenterX=Math.max(0,Math.min(referenceCenterX,referenceWidth));
		referenceCenterY+=referenceMouseY-lastReferenceMouseY;
		referenceCenterY=Math.max(0,Math.min(referenceCenterY,referenceHeight));
		lastReferenceMouseX=referenceMouseX;
		lastReferenceMouseY=referenceMouseY;
		drawing();
	}
	return false;
}

function referenceMouseUpHandler(event){
	stopEventPropagationAndDefaultAction(event);
	referenceMousePressed=false;	
	return false;
}

//  change the scaling with the mouse wheel
function referenceMouseWheelHandler(event){
	stopEventPropagationAndDefaultAction(event);
	if (event.deltaY>0){
		scaleOutputToInput*=changeScaleFactor;
	}
	else {
		scaleOutputToInput/=changeScaleFactor;
	}
	drawing();
	return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function referenceCanvasAddEventListeners(){
		referenceCanvas.addEventListener("mousedown",referenceMouseDownHandler,true);
		referenceCanvas.addEventListener("mouseup",referenceMouseUpHandler,true);
		referenceCanvas.addEventListener("mousemove",referenceMouseMoveHandler,true);
		referenceCanvas.addEventListener("mouseout",referenceMouseUpHandler,true);
		referenceCanvas.addEventListener("wheel",referenceMouseWheelHandler,true);	
}

//  manipulating the reference image (precision highlighting of sampled pixels)
//====================================================================

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
