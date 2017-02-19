"use strict";



/*
  u   u    sss     eeee   rrrr        iii     aaa
  u   u   s   s    e      r   r        i     a   a
  u   u   s        e      r   r        i     a   a
  u   u    sss     eee    rrrr         i     aaaaa
  u   u       s    e      r  r         i     a   a
  u   u       s    e      r   r        i     a   a
   uuu    ssss     eeee   r   r       iii    a   a
*/
// User interaction
//======================

//  the startup function
//==============================================================================

var initialOutputSize=512;

window.onload = function () {
    setupOutputCanvas();
    makeInteractions();
    setOutputDimensions(initialOutputSize, initialOutputSize);
    setXYSliderLimits();
    setX(Math.random()*(xMax-xMin)+xMin);
    setY(Math.random()*(yMax-yMin)+yMin);
    //iteration=circleIteration;
    //shadesOfGrey();
    iteration=threeIteration;
    rainbow();
    drawing();


};


// choosing output image sizes
//=============================
var outputCanvas;
var outputImage;

// image and pixel data of output canvas
var outputData;
var outputPixels;

// size for generated image
var outputWidth;
var outputHeight;

// the choosers
var outputWidthChooser;
var outputHeightChooser;

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function setupOutputCanvas() {
    outputCanvas = document.getElementById("outputCanvas");
    outputImage = outputCanvas.getContext("2d");
    outputCanvas.addEventListener("mousedown", outputMouseDownHandler, true);
    outputCanvas.addEventListener("mouseup", mouseUpHandler, true);
    outputCanvas.addEventListener("mousemove", outputMouseMoveHandler, true);
    outputCanvas.addEventListener("mouseout", mouseUpHandler, true);
    outputCanvas.addEventListener("wheel", outputMouseWheelHandler, true);
}

// set a new output width and height
// makes a blue screen as output image, sets up outputPixels

function setOutputDimensions(newWidth,newHeight){
    outputWidthChooser.value = newWidth.toString();
    outputHeightChooser.value = newHeight.toString();
    outputWidth = newWidth;
    outputHeight = newHeight;
    outputCanvas.width = outputWidth;
    outputCanvas.height = outputHeight;
    // make the canvas opaque, blue screen of nothing if there is no input image
    outputImage.fillStyle = "Blue";
    outputImage.fillRect(0, 0, outputWidth, outputHeight);
    // output canvas, get data of unit cell 
    outputData = outputImage.getImageData(0, 0, outputWidth, outputHeight);
    outputPixels = outputData.data;
    // the new length of the dynamics accumultor
    numbersDynamics.length=newWidth*newHeight;
}

//  changing the size of the image: 
function updateOutputDimensions(newWidth,newHeight) {
    newWidth = Math.round(newWidth);
    newHeight = Math.round(newHeight);
    if ((newWidth != outputWidth) || (newHeight != outputHeight)) {
        var oldWidth=outputWidth;
        var oldHeight=outputHeight;
        setOutputDimensions(newWidth,newHeight);
     }
}




// make up interactions with html elements: adds event listeners
function makeInteractions(){
    // we need the choosers to write back the corrected data
    outputWidthChooser = document.getElementById('outputWidthChooser');
    outputWidthChooser.addEventListener('change',function(){
            updateOutputDimensions(parseInt(outputWidthChooser.value,10),outputHeight);
            drawing();
        },false);
    outputHeightChooser = document.getElementById('outputHeightChooser');
    outputHeightChooser.addEventListener('change',function(){
            updateOutputDimensions(outputWidth, parseInt(outputHeightChooser.value,10));
            drawing();
        },false);
    xSlider=document.getElementById('xSlider');
    xSlider.addEventListener('change',function(){
    		setX(parseFloat(xSlider.value,10));
            drawing();
    	},false);
    xNumber=document.getElementById('xNumber');
    xNumber.addEventListener('change',function(){
    		setX(parseFloat(xNumber.value,10));
            drawing();
    	},false);
    ySlider=document.getElementById('ySlider');
    ySlider.addEventListener('change',function(){
    		setY(parseFloat(ySlider.value,10));
            drawing();
    	},false);
    yNumber=document.getElementById('yNumber');
    yNumber.addEventListener('change',function(){
    		setY(parseFloat(yNumber.value,10));
            drawing();
    	},false);
}


//  the canvase and its interaction
//============================================================================

// override default mouse actions, especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
    event.stopPropagation();
    event.preventDefault();
}

// the mouse is only on one canvas at a time
// current mouse data, with respect to the current canvas
var mousePressed = false;
var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;


//  set the mouse position from current event
function setMousePosition(event, theCanvas) {
    mouseX = event.pageX - theCanvas.offsetLeft;
    mouseY = event.pageY - theCanvas.offsetTop;
}

//  set the last mouse position from current mouse position
function setLastMousePosition() {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

// for all canvases: mouse down start interaction and sets last mouse position
function mouseDownHandler(event, theCanvas) {
    stopEventPropagationAndDefaultAction(event);
    mousePressed = true;
    setMousePosition(event, theCanvas);
    setLastMousePosition();
}

// for all canvases: mouse up or mouse out stops mouse interaction
function mouseUpHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    mousePressed = false;
    return false;
}


var changeSize = 1.1;

function outputMouseWheelHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    var factor = event.deltaY > 0 ? changeSize : 1 / changeSize;
    var center;
    var size;
    center=0.5*(xMax+xMin);
    size=factor*0.5*(xMax-xMin);
    xMax=center+size;
    xMin=center-size;
    center=0.5*(xMax+xMin);
    size=factor*0.5*(xMax-xMin);
    yMax=center+size;
    yMin=center-size;
    console.log(xMin);
    drawing();
    return false;
}

function outputMouseDownHandler(event) {
    mouseDownHandler(event, outputCanvas);
    return false;
}

function outputMouseMoveHandler(event) {
    stopEventPropagationAndDefaultAction(event);
    var d;
    if (mousePressed) {
        setMousePosition(event, outputCanvas);
        d=(mouseX - lastMouseX)/outputWidth*(xMax-xMin);
        xMin -= d;
        xMax -= d;
        d=(mouseY - lastMouseY)/outputHeight*(yMax-yMin);
        yMin -= d;
        yMax -= d;
        setXYSliderLimits();
        setLastMousePosition();
        drawing();
    }
    return false;
}

//  the iteration
//========================================================

// parameters for the mapping between (x,y) space and indices (i,j)
//==============================================================

var xMin=-2;
var xMax=2;
var yMin=-2;
var yMax=2;
var xScale;
var yScale;


//  the starting point
//===================================================
var xStart,yStart;
var xSlider,xNumber;
var ySlider,yNumber;

function setX(value){
	xStart=value;
	xSlider.value=value;
	xNumber.value=value;
}

function setY(value){
	yStart=value;
	ySlider.value=value;
	yNumber.value=value;
}

function setXYSliderLimits(){
	xSlider.min=xMin;
	xSlider.max=xMax;
	xSlider.step=0.01*(xMax-xMin);
	ySlider.min=yMin;
	ySlider.max=yMax;
	ySlider.step=0.01*(yMax-yMin);
}

//  the drawing and the iteration
//=====================================================

// storing the numbers from the dynamics
var numbersDynamics=[];
// the point
var x,y;
// and iterated
var xNew,yNew;

// number of iterations
var initializationIterations=100;
var initialProductionIterations=10000000;
var productionIterations;

function startup(){
	var iter;
	var length=numbersDynamics.length;
	for (iter=0;iter<length;iter++){
		numbersDynamics[iter]=0;
	}
	x=xStart;
	y=yStart;
	productionIterations=initialProductionIterations;
	for (iter=0;iter<initializationIterations;iter++){
		iteration();
		x=xNew;
		y=yNew;
	}
	//  from space to indices
	xScale=outputWidth/(xMax-xMin);
	yScale=outputHeight/(yMax-yMin);
}

function production(){
	var i,j;
	var iter;
	for (iter=0;iter<productionIterations;iter++){
		iteration();
		x=xNew;
		y=yNew;
		i=Math.round((x-xMin)*xScale);
		if ((i>0)&&(i<outputWidth)){
			j=Math.round((y-yMin)*yScale);
			if ((j>0)&&(j<outputHeight)){
				numbersDynamics[i+outputWidth*j]++;
			}
		}
	}
}

function imageGeneration(){
	var iter;
	var length=numbersDynamics.length;
	var maxNumber=0;
	for (iter=0;iter<length;iter++){
		maxNumber=Math.max(maxNumber, numbersDynamics[iter]);
	}
	console.log(maxNumber);
	var pixelByteIndex=0;
	var colorIndex;
	var colorScale=(reds.length-0.1)/maxNumber;
	for (iter=0;iter<length;iter++){
		colorIndex=Math.floor(numbersDynamics[iter]*colorScale);
		outputPixels[pixelByteIndex++]=reds[colorIndex];
		outputPixels[pixelByteIndex++]=greens[colorIndex];
		outputPixels[pixelByteIndex++]=blues[colorIndex];
		outputPixels[pixelByteIndex++]=255;
	}
}

function drawing(){
	startup();
	production();
	imageGeneration();
	outputImage.putImageData(outputData,0, 0);
}

var iteration;

function circleIteration(){
	var d=0.01;
	xNew=x-d*y;
	yNew=y+d*x;
	if (xNew<-1) xNew+=2;
	if (xNew>1) xNew-=2;
	if (yNew<-1) yNew+=2;
	if (yNew>1) yNew-=2;
}

var lambda=-1.706;
var alpha=1.506;
var gamma=1.4;

function threeIteration(){
	var x2=x*x-y*y;
	var y2=2*x*y;
	var rsq=x*x+y*y;
	xNew=(lambda+alpha*rsq)*x+gamma*x2;
	yNew=(lambda+alpha*rsq)*y-gamma*y2;
}

// the color tables
//=================================================

var reds=[];
var blues=[];
var greens=[];

function initColors(length){
	var iter;
	reds.length=length;
	greens.length=length;
	blues.length=length;
	for (iter=0;iter<length;iter++){
		reds[iter]=0;
		greens[iter]=0;
		blues[iter]=0;
	}
}

function shadesOfGrey(){
	var iter;
	var length=256;
	var grey;
	initColors(length);
	for (iter=0;iter<length;iter++){
		grey=Math.round(iter*255.5/length);
		reds[iter]=grey;
		greens[iter]=grey;
		blues[iter]=grey;
	}
}

function rainbow(){
	var i;
	initColors(1152);
	for (i=0;i<256;i++){
		reds[i]=i;    // from black to red
		reds[i+256]=255;   // from red to yellow
		greens[i+256]=i;
		reds[i+512]=255-i;    // from yellow to green
		greens[512+i]=255;
		if (i<128){
			greens[768+i]=255;   // from green to cyan
			blues[768+i]=2*i;
			greens[896+i]=255-2*i;   // from cyan to blue
			blues[896+i]=255;
			blues[1024+i]=255;     // from blue to violett
			reds[1024+i]=2*i;
		}
	}
}