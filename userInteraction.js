"use strict";

// all about loading an input image file
// ========================================================================
var inputLoaded=false;
var inputWidth=0;
var inputHeight=0;
var imageReader=new FileReader();
var inputImage = new Image();

// get pixel data of input image
var inputData;
var inputPixels;
	
// maximum size of reference image
var maxReferenceSize=300;
//  derived dimensions for the reference canvas
var referenceWidth;
var referenceHeight;
//  ratio of input image to reference image
var scaleInputToReference;

// first load the image data file in a file reader
function startLoadImage(files){
	imageReader.readAsDataURL(files[0]);
}
// then load the new image from the file reader data
imageReader.onload=function(imageReaderResult){ 
						inputImage.src=imageReader.result;
					};
// then use the image
inputImage.onload=useNewInputImage;

// we use an off-screen canvas to get the pixels of the input image
function getPixelsFromInputImage(){
	var offScreenCanvas;
	var offScreenCanvasImage;
	offScreenCanvas=document.createElement("canvas");
	offScreenCanvas.width=inputWidth;
	offScreenCanvas.height=inputHeight;
	offScreenCanvasImage=offScreenCanvas.getContext("2d");
	offScreenCanvasImage.drawImage(inputImage,0,0);	
	inputData=offScreenCanvasImage.getImageData(0,0,inputWidth,inputHeight);
	inputPixels=inputData.data;
}

function useNewInputImage() {  
	// data of the loaded image
	inputLoaded=true;
	inputWidth=inputImage.width;
	inputHeight=inputImage.height;
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
	// for farris only ---------------
	// refernce image: draw the entire input image and get the pixels
	referenceImage.drawImage(inputImage,0,0,inputWidth,inputHeight,
											  0,0,referenceWidth,referenceHeight);
	getPixelsFromReferenceCanvas();
	//----------------------------------------------------
	// read the input image pixels
	getPixelsFromInputImage();		
	// and finally (re)draw with this image
	drawing();
}

// choosing output image sizes and lengths of the periodic unit cell
//=====================================================================
// make it a multiple of four
function makeMultipleOf4(i){
	return i-i%4;
}

// default size for generated image
var outputWidth=0;
var	outputHeight=0;
	
// periods/size of periodic cell
var periodWidth=0;
var	periodHeight=0;

var patchWidth;
var patchHeight;

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

// set a new output width and height, multiple of 4
// only do something if they changed
// set canvas dimensions, and blue screen
//  limit period lengths
function updateOutputDimensions(newWidth,newHeight){
	newWidth=makeMultipleOf4(Math.round(newWidth));
	newHeight=makeMultipleOf4(Math.round(newHeight));
	outputWidthChooser.value=newWidth.toString();
	outputHeightChooser.value=newHeight.toString();
	if ((newWidth!=outputWidth)||(newHeight!=outputHeight)){
		outputWidth=newWidth;
		outputHeight=newHeight;
		outputCanvas.width=outputWidth;
		outputCanvas.height=outputHeight;
		// make the default blue-screen of nothing, sets alpha=255 !!!
		outputImage.fillStyle="Blue";	
		outputImage.fillRect(0,0,outputWidth,outputHeight);
	}
}

//  choose width and height, periods must be smaller or equal
function setWidth(data){
	updateOutputDimensions(parseInt(data),outputHeight);
	limitPeriod();   // to output dimensions
	drawing();
}
function setHeight(data){
	updateOutputDimensions(outputWidth,parseInt(data));
	limitPeriod();   // to output dimensions
	drawing();
}

// set a new period width and height, limited to output dimensions
// multiple of 4, do something only if they changed
//  take into account symmtries
//  gets output pixels
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
				periodHeight=Math.round(0.5774*newWidth);
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
				periodWidth=Math.round(1.732*newHeight);
			}
			else {
				periodWidth=newWidth;
			}
		}
		periodWidthChooser.value=periodWidth.toString();
		periodHeightChooser.value=periodHeight.toString();

		setPatchDimensions();
		// only for farris
		setupSinTables();
		setupMapTables();	
		// for farris: now get the opaque pixels of the periodic unit cell	
		// output canvas	
		getPixelsFromCanvas();		
	}
}

//  limit period dimensions to output image
function limitPeriod(){
	updatePeriod(periodWidth,periodHeight);
}

// choose width and height of periodic cell
function setPeriodWidth(data){
	updatePeriod(parseInt(data),periodHeight);
	drawing();
}
function setPeriodHeight(data){
	updatePeriod(periodWidth,parseInt(data));
	drawing();
}
