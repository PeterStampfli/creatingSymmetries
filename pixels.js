// color object
function Color(red,green,blue){
	this.red=red;
	this.green=green;
	this.blue=blue;
}

function color(){
	return new Color(0,0,0);
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


//  manipulating the reference image
//====================================================================
var referenceImageData;
var referenceImagePixels;

// get pixels from reference canvas
function getPixelsFromReferenceCanvas(){
	referenceImageData = referenceCanvasImage.getImageData(0,0,referenceWidth,referenceHeight);
	referenceImagePixels = referenceImageData.data;
}

// put pixels on reference canvas
function putPixelsOnReferenceCanvas(){
	referenceCanvasImage.putImageData(referenceImageData, 0, 0);
}

// fade-out all pixels by setting alpha
function setAlphaReferenceImagePixels(alpha){
	var theEnd=referenceImagePixels.length;
	for (var i=3;i<theEnd;i+=4){
		referenceImagePixels[i]=alpha;
	}
}

// to show used pixels, make a pixel of the reference image opaque
// given coordinates of input image  (i,j), already inside the input image
function setOpaqueReferenceImagePixelFromInputImage(i,j){
	i=Math.floor(scaleInputToReferenceImage*i);
	j=Math.floor(scaleInputToReferenceImage*j);
	referenceImagePixels[4*(referenceWidth*j+i)+3]=255;
}

	
