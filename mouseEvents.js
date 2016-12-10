"use strict";

// override default actions on the reference canvas
// especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
	event.stopPropagation();
	event.preventDefault();   
}

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
var scaleOutputToInput=2;
var changeScaleFactor=1.1;

function referenceMouseDownHandler(event){
	stopEventPropagationAndDefaultAction(event);
	referenceMousePressed=true;
	setReferenceMousePosition(event);
	lastReferenceMouseX=referenceMouseX;
	lastReferenceMouseY=referenceMouseY;
	drawing();
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
	drawing();
	return false;
}

function referenceMouseOutHandler(event){
	stopEventPropagationAndDefaultAction(event);
	referenceMousePressed=false;	
	drawing();
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
		referenceCanvas.addEventListener("mouseout",referenceMouseOutHandler,true);
		referenceCanvas.addEventListener("wheel",referenceMouseWheelHandler,true);	
}
