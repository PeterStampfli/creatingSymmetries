"use strict";

// control the offset of the output
var outputOffsetX=0;
var outputOffsetY=0;

// current mouse data, with respect to orientationCanvas
var outputMousePressed=false;
var outputMouseX;
var outputMouseY;
var lastOutputMouseX;
var lastOutputMouseY;

// change in size
var changeSize=1.1;

//  set the mouse angle from current event, relative to center
function outputMouseData(event){
	outputMouseX=event.pageX-outputCanvas.offsetLeft;
	outputMouseY=event.pageY-outputCanvas.offsetTop;
}

function outputMouseDownHandler(event){
	stopEventPropagationAndDefaultAction(event);
	outputMouseData(event);
	outputMousePressed=true;
	lastOutputMouseX=outputMouseX;
	lastOutputMouseY=outputMouseY;
	return false;
}

function outputMouseMoveHandler(event){
	stopEventPropagationAndDefaultAction(event);
	if (outputMousePressed){
		outputMouseData(event);
		outputOffsetX+=outputMouseX-lastOutputMouseX;
		if (outputOffsetX<0) {
			outputOffsetX+=periodWidth;
		}
		if (outputOffsetX>=periodWidth) {
			outputOffsetX-=periodWidth;
		}
		outputOffsetY+=outputMouseY-lastOutputMouseY;
		if (outputOffsetY<0) {
			outputOffsetY+=periodHeight;
		}
		if (outputOffsetY>=periodHeight) {
			outputOffsetY-=periodHeight;
		}
		lastOutputMouseX=outputMouseX;
		lastOutputMouseY=outputMouseY;
		// we don't need a full redraw
		putPixelsPeriodicallyOnCanvas();
		// hint for debugging
		showHintPatch();
	}
	return false;
}

function outputMouseUpHandler(event){
	stopEventPropagationAndDefaultAction(event);
	outputMousePressed=false;	
	return false;
}

function outputMouseOutHandler(event){
	stopEventPropagationAndDefaultAction(event);
	outputMousePressed=false;	
	return false;
}

function outputMouseWheelHandler(event){
	stopEventPropagationAndDefaultAction(event);
	if (event.deltaY>0){
		updateOutputDimensions(changeSize*outputWidth,changeSize*outputHeight);
		updatePeriod(changeSize*periodWidth,changeSize*periodHeight);
	}
	else {
		updateOutputDimensions(outputWidth/changeSize,outputHeight/changeSize);
		updatePeriod(periodWidth/changeSize,periodHeight/changeSize);
	}
	drawing();
	return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function outputCanvasAddEventListeners(){
		outputCanvas.addEventListener("mousedown",outputMouseDownHandler,true);
		outputCanvas.addEventListener("mouseup",outputMouseUpHandler,true);
		outputCanvas.addEventListener("mousemove",outputMouseMoveHandler,true);
		outputCanvas.addEventListener("mouseout",outputMouseOutHandler,true);
		outputCanvas.addEventListener("wheel",outputMouseWheelHandler,true);	
}

