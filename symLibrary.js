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
var periodWidth=256;
var	periodHeight=256;
	
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

// pixel data of canvas
var imageData;
var imagePixels;
// get pixels from canvas
function getPixelsFromCanvas(){
	imageData = canvasImage.getImageData(0,0,width,height);
	imagePixels = imageData.data;
}
// put pixels on canvas
function putPixelsOnCanvas(){
	canvasImage.putImageData(imageData, 0, 0);
}

// combine index to pixels from integer coordinates
//  is index to the red component of the pixel, green,blue and alpha follow
function index(i,j){
	return 4*(i+width*j);
}

// copy pixel values upwards
//  starting points: from=(fromI,fromJ) and to=(toI,toJ)
//  to goes up to including endTo=(endToI,endToJ)
//  and from goes up together with to
//  accounts for (canvas) width and 4 bytes per pixels !!!
function copyPixels(fromI,fromJ,toI,toJ,endToI,endToJ){
	var from=index(fromI,fromJ);
	var to=index(toI,toJ);
	var endTo=index(endToI,endToJ)+3;   
	while (to<=endTo) {  // do complete pixels
		imagePixels[to++]=imagePixels[from++];
		imagePixels[to++]=imagePixels[from++];
		imagePixels[to++]=imagePixels[from++];
		imagePixels[to++]=imagePixels[from++];
	}
}

// copy pixel values upwards/downwards, mirrored at vertical axis
//  starting points: from=(fromI,fromJ) and to=(toI,toJ)
//  to goes up to endTo=(endToI,endToJ)
//  and from goes down opposed to "to"
//  accounts for (canvas) width and 4 bytes per pixels
//  take care to keep pixels together
function copyPixelsMirrored(fromI,fromJ,toI,toJ,endToI,endToJ){
	var from=index(fromI,fromJ);
	var to=index(toI,toJ);
	var endTo=index(endToI,endToJ);
	while (to<=endTo) {  // do one complete pixel
		imagePixels[to++]=imagePixels[from++];
		imagePixels[to++]=imagePixels[from++];
		imagePixels[to++]=imagePixels[from++];
		imagePixels[to++]=imagePixels[from++];
		// now go backwards with from
		from-=8;
	}
}

// periodic repetition of unit cell
function periodic(){
	//repetition in horizontal direction
	for (var fromJ=0;fromJ<periodHeight;fromJ++){
		copyPixels(0,fromJ,periodWidth,fromJ,width-1,fromJ);
	}
	// repetition in vertical direction
	copyPixels(0,0,0,periodHeight,width-1,height-1);
}

// mirrorsymmetry in the unit cell at a horizontal axis
// lying at periodicHeight/2 with variable length (number of pixels)
//  reasonable values are periodicLength or periodicLength/2
function horizontalMirror(length){
	for (var fromJ=0;fromJ<periodHeight/2;fromJ++){
		copyPixels(0,fromJ,0,periodHeight-1-fromJ,length-1,periodHeight-1-fromJ);
	}
}

// mirrorsymmetry in the unit cell at a vertical axis
// lying at periodicWidth/2, with variable length (number of pixels)
//  reasonable values are periodicLength and periodicLength/2
function verticalMirror(length){
	for (var fromJ=0;fromJ<length;fromJ++){
		copyPixelsMirrored(periodWidth/2-1,fromJ,periodWidth/2,fromJ,periodWidth-1,fromJ);
	}
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
	getPixelsFromCanvas();
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
	periodic();
	putPixelsOnCanvas();
	
	
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
	var i=0;
	console.log(i++);
	console.log(i++);
}
