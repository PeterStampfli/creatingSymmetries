// load an image file, use as input
var inputImageLoaded=false;
var inputImageWidth,inputImageHeight;
var imageReader=new FileReader();
var inputImage = new Image();
// first load the image data
function startLoadImage(files){
	imageReader.readAsDataURL(files[0]);
}
// then create an image object
imageReader.onload=function(imageReaderResult){ 
	inputImage.src=imageReader.result;
}
// redraw using the (new) image
inputImage.addEventListener("load", 
	function() {  
		inputImageLoaded=true;
		inputImageWidth=inputImage.width;
		inputImageHeight=inputImage.height;
		var imageSize=Math.max(inputImageWidth,inputImageHeight);
		if (imageSize<maxReferenceImageSize){
			referenceWidth=inputImageWidth;
			referenceHeight=inputImageHeight;
		}
		else {
			referenceWidth=inputImageWidth*maxReferenceImageSize/imageSize;
			referenceHeight=inputImageHeight*maxReferenceImageSize/imageSize;
			
		}
		drawing();
	}, false);

// make an even number
function makeEven(i){
	return i+i%2;
}





// default size for generated image
var width=512,
	height=512;
	
// periods/size of periodic cell
var periodWidth=256,
	periodHeight=256;
	
// maximum size of referenceimage
var maxReferenceImageSize=300;
//  derived dimensions for the refernece canvas
var referenceWidth;
var referenceHeight;

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

// set the canvas size, make a blue background and write the image on it (scale 100%)
function startDrawing(){
	canvas.width=width;
	canvas.height=height;
	canvasImage.fillStyle="Blue";	
	canvasImage.fillRect(0,0,width,height);
	if (inputImageLoaded){
		canvasImage.drawImage(inputImage,0,0);
	}
	canvasImage.strokeStyle="Red";	
	canvasImage.strokeRect(0,0,periodWidth,periodHeight);
	
}

// set the reference canvas size, and write the image on it
function startReferenceDrawing(){
	referenceCanvas.width=referenceWidth;
	referenceCanvas.height=referenceHeight;
	referenceCanvasImage.fillStyle="Blue";	
	referenceCanvasImage.fillRect(0,0,width,height);
	if (inputImageLoaded){
		referenceCanvasImage.drawImage(inputImage,0,0,inputImageWidth,inputImageHeight,
		                                          0,0,referenceWidth,referenceHeight);
	}
}

// on loading the page: get canvas and canvas context
// create image download function, using jpeg image format,default quality=0.92
// start drawing
var canvas, canvasImage;
var referenceCanvas,referenceCanvasImage;
var downloadFilename='theImage.jpg';

window.onload=function(){
	referenceCanvas=document.getElementById("referenceCanvas");	
	referenceCanvasImage=referenceCanvas.getContext("2d");
	canvas=document.getElementById("canvas");	
	canvasImage=canvas.getContext("2d");
	var downloadButton=document.getElementById('download')
	if (downloadButton!=null){
		downloadButton.addEventListener('click', function() {
			this.href = canvas.toDataURL("image/jpeg");
			this.download = downloadFilename;
		}, false);
	}
	drawing();
}
