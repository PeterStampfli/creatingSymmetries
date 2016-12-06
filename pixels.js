
// pixel data of canvas, using only one periodic unit cell
var imageData;
var imagePixels;
// get pixels from canvas,use only the unit cell
function getPixelsFromCanvas(){
	imageData = canvasImage.getImageData(0,0,periodWidth,periodHeight);
	imagePixels = imageData.data;
}

//  put pixels periodically on canvas
function putPixelsPeriodicallyOnCanvas(){
	var copyWidth;
	var copyHeight;
	for (var cornerY=0;cornerY<height;cornerY+=periodHeight){
		copyHeight=Math.min(height-cornerY,periodHeight);
		for (var cornerX=0;cornerX<width;cornerX+=periodWidth){
			copyWidth=Math.min(width-cornerX,periodWidth);
			canvasImage.putImageData(imageData, cornerX, cornerY,
			                         0,0,copyWidth,copyHeight);

		}
	}
	
}




//  manipulating the reference image (precision highlighting of sampled pixels)
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

	
