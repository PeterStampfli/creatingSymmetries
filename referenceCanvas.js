"use strict";

// the reference canvas related to input image
// and the transform to get a pixel

var referenceCanvas=new PixelCanvas('referenceCanvas');

referenceCanvas.baseSize=300;
referenceCanvas.scaleFromInputImage=1;

// adjust size fitting to input image, draw new input, make pixels
referenceCanvas.adjust=function(){
	if (inputImage.width>inputImage.height){
		referenceCanvas.setSize(referenceCanvas.baseSize,
			                    Math.round(referenceCanvas.baseSize*inputImage.height/inputImage.width));
	}
	else {
		referenceCanvas.setSize(Math.round(referenceCanvas.baseSize*inputImage.width/inputImage.height),
			                    referenceCanvas.baseSize);
	}
	referenceCanvas.scaleFromInputImage=referenceCanvas.width/inputImage.width;
	referenceCanvas.canvasImage.drawImage(inputImage.image,0,0,referenceCanvas.width,referenceCanvas.height);
	referenceCanvas.createPixels();
}

var inputTransform=new Transform(elementaryFastFunction);

// get interpolated image pixel
// set the color depending on the given vector2 position
// mark reference pixel
function getInputColor(color,position){

}