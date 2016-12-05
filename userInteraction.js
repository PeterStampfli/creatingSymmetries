// delete a javascript warning (only the first one with id="warning"
//==================================
function deleteWarning(){
	var element = document.getElementById("warning");
	element.parentNode.removeChild(element);
}

//  canvases, their context
//======================================================
var canvas, canvasImage;
var referenceCanvas,referenceCanvasImage;

function getCanvases(){
	referenceCanvas=document.getElementById("referenceCanvas");	
	referenceCanvasImage=referenceCanvas.getContext("2d");
	canvas=document.getElementById("canvas");	
	canvasImage=canvas.getContext("2d");
}


// all about loading an input image file
// ========================================================================

var inputImageLoaded=false;
var inputImageWidth=0;
var inputImageHeight=0;
var imageReader=new FileReader();
var inputImage = new Image();

// get pixel data of input image
var inputImageData;
var inputImagePixels;
	
// maximum size of reference image
var maxReferenceImageSize=300;
//  derived dimensions for the reference canvas
var referenceWidth;
var referenceHeight;
//  ratio of input image to reference image
var scaleInputToReferenceImage;

// we use an off-screen canvas
function getPixelsFromInputImage(){
	var offScreenCanvas;
	var offScreenCanvasImage;
	offScreenCanvas=document.createElement("canvas");
	offScreenCanvas.width=inputImageWidth;
	offScreenCanvas.height=inputImageHeight;
	offScreenCanvasImage=offScreenCanvas.getContext("2d");
	offScreenCanvasImage.drawImage(inputImage,0,0);
	inputImageData=offScreenCanvasImage.getImageData(0,0,inputImageWidth,inputImageHeight);
	inputImagePixels=inputImageData.data;
}

// first load the image data
function startLoadImage(files){
	imageReader.readAsDataURL(files[0]);
}
// then create an image object
imageReader.onload=function(imageReaderResult){ 
	inputImage.src=imageReader.result;
}

// using the (new) image
inputImage.addEventListener("load", 
	function() {  
		// data for loaded image
		inputImageLoaded=true;
		inputImageWidth=inputImage.width;
		inputImageHeight=inputImage.height;
		// set up dimensions of the reference image
		var inputImageSize=Math.max(inputImageWidth,inputImageHeight);
		if (inputImageSize<maxReferenceImageSize){
			referenceWidth=inputImageWidth;
			referenceHeight=inputImageHeight;
		}
		else {
			referenceWidth=Math.round(inputImageWidth*maxReferenceImageSize/inputImageSize);
			referenceHeight=Math.round(inputImageHeight*maxReferenceImageSize/inputImageSize);			
		}
		referenceCanvas.width=referenceWidth;
		referenceCanvas.height=referenceHeight;
		// put center of readings to image center
		mouseX=referenceWidth/2;
		mouseY=referenceHeight/2;
		scaleInputToReferenceImage=Math.min(referenceWidth/inputImageWidth,
		                                    referenceHeight/inputImageHeight);
		// read the pixels
		getPixelsFromInputImage();		
		// and finally (re)draw with this image
		drawing();
	}, false);

// choosing image sizes and lengths of the periodic unit cell
//=====================================================================

// make an even number
function makeEven(i){
	return i+i%2;
}

// default size for generated image
var width=512,
	height=512;
	
// periods/size of periodic cell
var periodWidth=256;
var	periodHeight=256;

// for basic patching: region sizes
var patchWidth;
var patchHeight;
// their size depends on the period sizes and the symmetry
function setPatchDimensions(){
	patchWidth=periodWidth/2;
	patchHeight=periodHeight/2;
}

//  choose width and height, periods must be smaller or equal
function setWidth(data){
	width=makeEven(parseInt(data));
	periodWidth=Math.min(periodWidth,width);
	drawing();
}
function setHeight(data){
	height=makeEven(parseInt(data));
	periodHeight=Math.min(periodHeight,height);
	drawing();
}

// choose width and height of periodic cell
function setPeriodWidth(data){
	periodWidth=Math.min(makeEven(parseInt(data)),width);
	drawing();
}
function setPeriodHeight(data){
	periodHeight=Math.min(makeEven(parseInt(data)),height);
	drawing();
}


//  for image downloading, using jpeg image format, default quality=0.92
//=================================================================
var downloadFilename='theImage.jpg';

function activateImageDownloadButton(){
	var downloadButton=document.getElementById('download')
	if (downloadButton!=null){
		downloadButton.addEventListener('click', function() {
			this.href = canvas.toDataURL("image/jpeg");
			this.download = downloadFilename;
		}, false);
	}
}
