"use strict";

//  orientation canvas is square
var orientationSize;
var angle;
var changeAngle=0.05;
var cosAngle;
var sinAngle;
var radius;

// take care of trigonometric functions
function setAngle(newAngle){
	angle=newAngle;
	cosAngle=Math.cos(angle);
	sinAngle=Math.sin(angle);
}

// setup the orientation canvas dimensions and transformation matrix
//  zero is at center und unit is radius (half the size)
function setupOrientationCanvas(size){
	orientationSize=size;
	orientationCanvas.width=size;
	orientationCanvas.height=size;
	radius=orientationSize/2-1;
	orientationImage.scale(radius,radius);
	orientationImage.translate(1,1);
	setAngle(0);
	drawOrientation();
}

// we use transformed coordinates
function drawOrientation(){
	var arrowWidth=0.2;
	orientationImage.fillStyle="White";	
	orientationImage.beginPath();
	orientationImage.arc(0,0,1,0,2*Math.PI,1);	
	orientationImage.fill();
	orientationImage.fillStyle="Brown";	
	orientationImage.beginPath();
	orientationImage.moveTo(cosAngle,sinAngle);
	orientationImage.lineTo(arrowWidth*sinAngle,-arrowWidth*cosAngle);
	orientationImage.lineTo(-arrowWidth*cosAngle,-arrowWidth*sinAngle);
	orientationImage.lineTo(-arrowWidth*sinAngle,arrowWidth*cosAngle);
	orientationImage.fill();
}

// current mouse data, with respect to orientationCanvas
var orientationMousePressed=false;
var orientationMouseX;
var orientationMouseY;
var mouseAngle=0;
var lastMouseAngle=0;

//  set the mouse angle from current event, relative to center
function orientationMouseData(event){
	orientationMouseX=event.pageX-orientationCanvas.offsetLeft-orientationSize/2;
	orientationMouseY=event.pageY-orientationCanvas.offsetTop-orientationSize/2;
	mouseAngle=Math.atan2(orientationMouseY,orientationMouseX);
}

function isMouseOnDisc(){
	return (orientationMouseX*orientationMouseX+orientationMouseY*orientationMouseY)<radius*radius;
}

function orientationMouseDownHandler(event){
	stopEventPropagationAndDefaultAction(event);
	orientationMouseData(event);
	if (isMouseOnDisc()){
		orientationMousePressed=true;
		lastMouseAngle=mouseAngle;
	}
	return false;
}

function orientationMouseMoveHandler(event){
	stopEventPropagationAndDefaultAction(event);
	orientationMouseData(event);
	if (orientationMousePressed){
		if (isMouseOnDisc()){
			setAngle(angle+mouseAngle-lastMouseAngle);
			lastMouseAngle=mouseAngle;
			drawOrientation();
			drawing();
		}
		else {    // out of disc
				orientationMousePressed=false;	
		}
	}
	return false;
}

function orientationMouseUpHandler(event){
	stopEventPropagationAndDefaultAction(event);
	orientationMousePressed=false;	
	return false;
}

function orientationMouseOutHandler(event){
	stopEventPropagationAndDefaultAction(event);
	orientationMousePressed=false;	
	return false;
}

function orientationMouseWheelHandler(event){
	stopEventPropagationAndDefaultAction(event);
	orientationMouseData(event)
	if (isMouseOnDisc()){
		if (event.deltaY>0){
			setAngle(angle+changeAngle);
		}
		else {
			setAngle(angle-changeAngle);
		}
		drawOrientation();
		drawing();
	}
	return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function orientationCanvasAddEventListeners(){
		orientationCanvas.addEventListener("mousedown",orientationMouseDownHandler,true);
		orientationCanvas.addEventListener("mouseup",orientationMouseUpHandler,true);
		orientationCanvas.addEventListener("mousemove",orientationMouseMoveHandler,true);
		orientationCanvas.addEventListener("mouseout",orientationMouseOutHandler,true);
		orientationCanvas.addEventListener("wheel",orientationMouseWheelHandler,true);	
}