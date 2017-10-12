"use strict";

// the reference canvas related to input image
// and the transform to get a pixel

var referenceCanvas=new PixelCanvas('referenceCanvas');

referenceCanvas.baseSize=300;
// length ratio from input image to reference canvas
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

// mouse control to change the input transform
var referenceMouseEvents=new MouseEvents('referenceCanvas');
referenceMouseEvents.addBasicDownUpOutActions();


// wheel action for changing the scale
referenceMouseEvents.addWheelAction(function(event, mouseEvents){
	var factor=1.1;
	var transform=map.transform;
	if (event.deltaY<0){
		factor=1/factor;
	}
	inputTransform.changeScale(factor);
  	createImage();
});
// mouse move shifts the image
referenceMouseEvents.addMoveAction(function(event, mouseEvents){
	inputTransform.addShift(mouseEvents.dx/referenceCanvas.scaleFromInputImage,
		                    mouseEvents.dy/referenceCanvas.scaleFromInputImage);
  	createImage();
});
