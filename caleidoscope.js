"use strict";

// collection of small functions used in different places
//=================================================================

// override default mouse actions, especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
	event.stopPropagation();
	event.preventDefault();   
}

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
var imageReader=new FileReader();
var inputImage = new Image();

// get pixel data of input image
var inputData;
var inputPixels;

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
	inputData=offScreenCanvasImage.getImageData(0,0,inputWidth,inputHeight);
	inputPixels=inputData.data;	
	// set the dimensions of the reference canvas and draw image on it
	setupReference();
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

