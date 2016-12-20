"use strict";

// collection of small functions used in different places
//=================================================================

// return a (smaller) multiple of four of any integer
function makeMultipleOf4(i){
	return i-i%4;
}

// accelerated trigonometric functions for the mapping functions:
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

// User interaction, in sequence of the html code
//====================================================

//  choose and load the input image file
//=================================================
var inputLoaded=false;
var inputWidth;
var inputHeight;
var inputImage;

// get pixel data of input image
var inputData;
var inputPixels;

// first load the image data file in a file reader
var imageReader=new FileReader();
function startLoadImage(files){
	imageReader.readAsDataURL(files[0]);
}

// connect the inputImage to the file reader and to subsequent processing
function connectNewInputImage(){
	inputImage=new Image();
	 // load the new image from the file reader data
	imageReader.onload=function(imageReaderResult){ 
							inputImage.src=imageReader.result;
						};
	// then use the image
	inputImage.onload=useNewInputImage;
}

function useNewInputImage() {  
	var offScreenCanvas;
	var offScreenCanvasImage;
	// data of the loaded image
	inputLoaded=true;
	inputWidth=inputImage.width;
	inputHeight=inputImage.height;
	// we use an off-screen canvas to get the data of the input image
	offScreenCanvas=document.createElement("canvas");
	offScreenCanvas.width=inputWidth;
	offScreenCanvas.height=inputHeight;
	offScreenCanvasImage=offScreenCanvas.getContext("2d");
	offScreenCanvasImage.drawImage(inputImage,0,0);	
	// set the dimensions of the reference canvas and draw image on it
	setupReference();
	// reference image: draw the entire input image and get the pixels
	referenceImage.drawImage(inputImage,0,0,inputWidth,inputHeight,
											  0,0,referenceWidth,referenceHeight);
	// free image for garbage collection
	connectNewInputImage();
	referenceData = referenceImage.getImageData(0,0,referenceWidth,referenceHeight);
	referencePixels = referenceData.data;
	inputData=offScreenCanvasImage.getImageData(0,0,inputWidth,inputHeight);
	inputPixels=inputData.data;	
	drawing();
}

// choosing output image sizes and lengths of the periodic unit cell
//===============================================================

// connect the choosers
var outputWidthChooser;
var outputHeightChooser;
var periodWidthChooser;
var periodHeightChooser;

function getChoosers(){
	outputWidthChooser=document.getElementById('outputWidthChooser');
	outputHeightChooser=document.getElementById('outputHeightChooser');
	periodWidthChooser=document.getElementById('periodWidthChooser');
	periodHeightChooser=document.getElementById('periodHeightChooser');
}

// size for generated image
var outputWidth;
var	outputHeight;
	
// periods/size of periodic cell
var periodWidth;
var	periodHeight;
//  their quarters
var periodWidth4;
var periodHeight4;

var patchWidth;
var patchHeight;


// set a new period width and height, limited to output dimensions
// force multiple of 4, fix ratio between width and height for special symmetries
// get output pixels of the periodic unit cell
function updatePeriod(newWidth,newHeight){
	newWidth=Math.min(makeMultipleOf4(Math.round(newWidth)),outputWidth);
	newHeight=Math.min(makeMultipleOf4(Math.round(newHeight)),outputHeight);
	if ((newWidth!=periodWidth)||(newHeight!=periodHeight)){
		if (periodWidth!=newWidth){
			periodWidth=newWidth;
			if (squareSymmetry){
				periodHeight=newWidth;
			}
			else if (hexagonSymmetry){
				periodHeight=makeMultipleOf4(Math.round(0.5774*newWidth));
			}
			else {
				periodHeight=newHeight;
			}
		}
		else {
			periodHeight=newHeight;
			if (squareSymmetry){
				periodWidth=newHeight;
			}
			else if (hexagonSymmetry){
				periodWidth=makeMultipleOf4(Math.round(1.732*newHeight));
			}
			else {
				periodWidth=newWidth;
			}
		}
		periodWidthChooser.value=periodWidth.toString();
		periodHeightChooser.value=periodHeight.toString();
		setPatchDimensions();
		setupSinTable(sinXTab,periodWidth);
		setupSinTable(sinYTab,periodHeight);
		mapXTab.length=patchWidth*patchHeight;
		mapYTab.length=patchWidth*patchHeight;
		setupMapTables();	
		periodWidth4=periodWidth/4;
		periodHeight4=periodHeight/4;
		// output canvas, get data of unit cell	
		outputData = outputImage.getImageData(0,0,periodWidth,periodHeight);
		outputPixels = outputData.data;
	}
}

// set a new output width and height, forces it to be a multiple of 4
// makes a blue screen as output image
// does NOT limit the period dimensions (avoid tangle, responsability of callers)
function updateOutputDimensions(newWidth,newHeight){
	newWidth=makeMultipleOf4(Math.round(newWidth));
	newHeight=makeMultipleOf4(Math.round(newHeight));
	if ((newWidth!=outputWidth)||(newHeight!=outputHeight)){
		outputWidthChooser.value=newWidth.toString();
		outputHeightChooser.value=newHeight.toString();
		outputWidth=newWidth;
		outputHeight=newHeight;
		outputCanvas.width=outputWidth;
		outputCanvas.height=outputHeight;
		// make the canvas opaque, blue screen of nothing if there is no input image
		outputImage.fillStyle="Blue";	
		outputImage.fillRect(0,0,outputWidth,outputHeight);
	}
}

//  choose output image width and height, limit periods
function setWidth(data){
	updateOutputDimensions(parseInt(data),outputHeight);
	updatePeriod(periodWidth,periodHeight);   // limit the period
	drawing();
}
function setHeight(data){
	updateOutputDimensions(outputWidth,parseInt(data));
	updatePeriod(periodWidth,periodHeight);   // limit the period
	drawing();
}

// choose width and height of periodic unit cell
function setPeriodWidth(data){
	updatePeriod(parseInt(data),periodHeight);
	drawing();
}
function setPeriodHeight(data){
	updatePeriod(periodWidth,parseInt(data));
	drawing();
}

//  the download buttons
//=========================================================================

var imageFilename='theImage.jpg';
var htmlFilename='caleidoscope.html';
var cssFilename='caleidoscope.css';
// using a minified js file for the actual html page -> download the unminified js file
var jsDownloadname='caleidoscope.js';
var jsFilename='caleidoscope.js';

function activateDownloadButtons(){
	function addDownload(button,downloadname,filename){
		button.addEventListener('click', function() {
			this.href = filename;
			this.download = filename;
		}, false);
	}
	var downloadImageButton=document.getElementById('downloadImageButton');
	//  for image downloading, using jpeg image format, default quality=0.92
	downloadImageButton.addEventListener('click', function() {
		//  use correct data format and filename
		this.href = outputCanvas.toDataURL("image/jpeg");  // this needs to be done at the time of the click
		this.download = imageFilename;
	}, false);
	addDownload(document.getElementById('downloadHTMLButton'),htmlFilename,htmlFilename);
	addDownload(document.getElementById('downloadCSSButton'),cssFilename,cssFilename);
	addDownload(document.getElementById('downloadJSButton'),jsDownloadname,jsFilename);
}

//  the canvases and their interaction
//============================================================================
var outputCanvas;
var outputImage;
var referenceCanvas;
var referenceImage;
var orientationCanvas;
var orientationImage;

// image and pixel data of output canvas, using only one periodic unit cell
var outputData;
var outputPixels;
// image and pixel data of the reference canvas
var referenceData;
var referencePixels;

function getCanvases(){
	referenceCanvas=document.getElementById("referenceCanvas");	
	referenceImage=referenceCanvas.getContext("2d");
	outputCanvas=document.getElementById("outputCanvas");	
	outputImage=outputCanvas.getContext("2d");
	orientationCanvas=document.getElementById("orientationCanvas");	
	orientationImage=orientationCanvas.getContext("2d");
}

// override default mouse actions, especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
	event.stopPropagation();
	event.preventDefault();   
}

// the mouse is only on one canvas at a time
// current mouse data, with respect to the current canvas
var mousePressed=false;
var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;

//  set the mouse position from current event
function setMousePosition(event,theCanvas){
	mouseX=event.pageX-theCanvas.offsetLeft;
	mouseY=event.pageY-theCanvas.offsetTop;
}

//  set the last mouse position from current mouse position
function setLastMousePosition(){
	lastMouseX=mouseX;
	lastMouseY=mouseY;
}

// for all canvases: mouse down start interaction and sets last mouse position
function mouseDownHandler(event,theCanvas){
	stopEventPropagationAndDefaultAction(event);
	mousePressed=true;
	setMousePosition(event,theCanvas);
	setLastMousePosition();
}

// for all canvases: mouse up or mouse out stops mouse interaction
function mouseUpHandler(event){
	stopEventPropagationAndDefaultAction(event);
	mousePressed=false;	
	return false;
}

// the output canvas interactions
//=================================================

// control the offset of the output
var outputOffsetX=0;
var outputOffsetY=0;

// and change its size
var changeSize=1.1;

// limit offset the upper left corner of the first fully visible unit cell
function limitOffset(){
	if (outputOffsetX<0) {
		outputOffsetX+=periodWidth;
	}
	if (outputOffsetX>=periodWidth) {
		outputOffsetX-=periodWidth;
	}
	if (outputOffsetY<0) {
		outputOffsetY+=periodHeight;
	}
	if (outputOffsetY>=periodHeight) {
		outputOffsetY-=periodHeight;
	}
}

function outputMouseDownHandler(event){
	mouseDownHandler(event,outputCanvas);
	return false;
}

function outputMouseMoveHandler(event){
	stopEventPropagationAndDefaultAction(event);
	if (mousePressed){
		setMousePosition(event,outputCanvas);
		outputOffsetX+=mouseX-lastMouseX;
		outputOffsetY+=mouseY-lastMouseY;
		limitOffset();
		setLastMousePosition();
		// we don't need a full redraw
		putPixelsPeriodicallyOnCanvas();
		// hint for debugging
		showHintPatch();
	}
	return false;
}

function outputMouseWheelHandler(event){
	stopEventPropagationAndDefaultAction(event);
	var factor=event.deltaY>0?changeSize:1/changeSize;
	updateOutputDimensions(factor*outputWidth,factor*outputHeight);
	updatePeriod(factor*periodWidth,factor*periodHeight);
	outputOffsetX*=factor;
	outputOffsetY*=factor;
	limitOffset();
	drawing();
	return false;
}

// listeners for useCapture, acting in bottom down capturing phase
//  they should return false to stop event propagation ...
function outputCanvasAddEventListeners(){
		outputCanvas.addEventListener("mousedown",outputMouseDownHandler,true);
		outputCanvas.addEventListener("mouseup",mouseUpHandler,true);
		outputCanvas.addEventListener("mousemove",outputMouseMoveHandler,true);
		outputCanvas.addEventListener("mouseout",mouseUpHandler,true);
		outputCanvas.addEventListener("wheel",outputMouseWheelHandler,true);	
}

// the reference canvas interactions
//==========================================================================
// maximum size of reference image
var referenceSize=300;
//  derived dimensions for the reference canvas
var referenceWidth;
var referenceHeight;
//  ratio of input image to reference image
var scaleInputToReference;
//  center for sampling on reference canvas
var referenceCenterX;
var referenceCenterY;

// the wheel changes the scale: map to input image pixels, a larger scale zooms out
var scaleOutputToInput=1;
var changeScaleFactor=1.1;

function setupReference(){
	// set up dimensions of the reference image
	// the reference canvas has the same width/height ratio as the input image
	//   the larger dimension is equal to the referenceSize
	var inputSize=Math.max(inputWidth,inputHeight);
	if (inputWidth>inputHeight){
		referenceWidth=referenceSize;
		referenceHeight=Math.round(referenceWidth*inputHeight/inputWidth);
	}
	else {
		referenceHeight=referenceSize;
		referenceWidth=Math.round(referenceHeight*inputWidth/inputHeight);
	}
	referenceCanvas.width=referenceWidth;
	referenceCanvas.height=referenceHeight;
	// put center of readings to image center
	referenceCenterX=referenceWidth/2;
	referenceCenterY=referenceHeight/2;
	// get scale of mapping from input image to the reference image
	scaleInputToReference=referenceWidth/inputWidth;
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

function referenceMouseDownHandler(event){
	mouseDownHandler(event,referenceCanvas);
	return false;
}

function referenceMouseMoveHandler(event){
	stopEventPropagationAndDefaultAction(event);
	if (mousePressed){
		setMousePosition(event,referenceCanvas);
		referenceCenterX+=mouseX-lastMouseX;
		referenceCenterX=Math.max(0,Math.min(referenceCenterX,referenceWidth));
		referenceCenterY+=mouseY-lastMouseY;
		referenceCenterY=Math.max(0,Math.min(referenceCenterY,referenceHeight));
		setLastMousePosition();
		drawing();
	}
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

function referenceCanvasAddEventListeners(){
		referenceCanvas.addEventListener("mousedown",referenceMouseDownHandler,true);
		referenceCanvas.addEventListener("mouseup",mouseUpHandler,true);
		referenceCanvas.addEventListener("mousemove",referenceMouseMoveHandler,true);
		referenceCanvas.addEventListener("mouseout",mouseUpHandler,true);
		referenceCanvas.addEventListener("wheel",referenceMouseWheelHandler,true);	
}

// orientation canvas and its interactions
//=========================================================
//  orientation canvas is square and gives the orientation angle of sampling
var orientationSize;
var angle;
var cosAngle;
var sinAngle;

var changeAngle=0.05;
var mouseAngle=0;
var lastMouseAngle=0;

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
	orientationImage.scale(orientationSize/2-1,orientationSize/2-1);
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

function isMouseOnDisc(){
	var radius=orientationSize/2-1;
	return ((mouseX-radius)*(mouseX-radius)+(mouseY-radius)*(mouseY-radius))<radius*radius;
}


function orientationMouseDownHandler(event){
	//stopEventPropagationAndDefaultAction(event);
	setMousePosition(event,orientationCanvas);
	if (isMouseOnDisc()){
		mousePressed=true;
		lastMouseAngle=Math.atan2(mouseY-orientationSize/2,mouseX-orientationSize/2);;
	}
	return false;
}

function orientationMouseMoveHandler(event){
	//stopEventPropagationAndDefaultAction(event);
	setMousePosition(event,orientationCanvas);
	if (mousePressed){
		if (isMouseOnDisc()){
			mouseAngle=Math.atan2(mouseY-orientationSize/2,mouseX-orientationSize/2);
			setAngle(angle+mouseAngle-lastMouseAngle);
			lastMouseAngle=mouseAngle;
			drawOrientation();
			drawing();
		}
		else {    // out of disc
			mousePressed=false;	
		}
	}
	return false;
}

function orientationMouseWheelHandler(event){
	setMousePosition(event,orientationCanvas);
	if (isMouseOnDisc()){
		stopEventPropagationAndDefaultAction(event);
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

function orientationCanvasAddEventListeners(){
		orientationCanvas.addEventListener("mousedown",orientationMouseDownHandler,true);
		orientationCanvas.addEventListener("mouseup",mouseUpHandler,true);
		orientationCanvas.addEventListener("mousemove",orientationMouseMoveHandler,true);
		orientationCanvas.addEventListener("mouseout",mouseUpHandler,true);
		orientationCanvas.addEventListener("wheel",orientationMouseWheelHandler,true);	
}
