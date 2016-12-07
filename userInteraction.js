//  canvases, their context
//======================================================
var outputCanvas;
var outputImage;
var referenceCanvas;
var referenceImage;

function getCanvases(){
	referenceCanvas=document.getElementById("referenceCanvas");	
	referenceImage=referenceCanvas.getContext("2d");
	outputCanvas=document.getElementById("canvas");	
	outputImage=outputCanvas.getContext("2d");
}

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
}
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
	mouseX=referenceWidth/2;
	mouseY=referenceHeight/2;
	// get scale of mapping from input image to the reference image
	scaleInputToReference=Math.min(referenceWidth/inputWidth,
										referenceHeight/inputHeight);
	// read the pixels into
	getPixelsFromInputImage();		
	// and finally (re)draw with this image
	drawing();
}

// choosing image sizes and lengths of the periodic unit cell
//=====================================================================
function makeEven(i){
	return i+i%2;
}

// default size for generated image
var outputWidth=512,
	outputHeight=512;
	
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
	outputWidth=makeEven(parseInt(data));
	periodWidth=Math.min(periodWidth,outputWidth);
	drawing();
}
function setHeight(data){
	outputHeight=makeEven(parseInt(data));
	periodHeight=Math.min(periodHeight,outputHeight);
	drawing();
}

// choose width and height of periodic cell
function setPeriodWidth(data){
	periodWidth=Math.min(makeEven(parseInt(data)),outputWidth);
	drawing();
}
function setPeriodHeight(data){
	periodHeight=Math.min(makeEven(parseInt(data)),outputHeight);
	drawing();
}

//  for image downloading, using jpeg image format, default quality=0.92
//=================================================================
var imageFilename='theImage.jpg';

function activateImageDownloadButton(){
	var downloadButton=document.getElementById('download')
	if (downloadButton!=null){
		downloadButton.addEventListener('click', function() {
			//  use correct data format and filename
			this.href = outputCanvas.toDataURL("image/jpeg");
			this.download = imageFilename;
		}, false);
	}
}
