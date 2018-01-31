"use strict";

// the reference canvas related to input image
// and the transform to get a pixel

var referenceCanvas=new PixelCanvas('referenceCanvas');

var inputTransform=new Transform(elementaryFastFunction);
    inputTransform.setScale(initialInputScale);

// mouse control to change the input transform
var referenceMouseEvents=new MouseEvents('referenceCanvas');

// length ratio from input image to reference canvas
referenceCanvas.scaleFromInputImage=1;

// adjust size fitting to input image, draw new input, make pixels
referenceCanvas.adjust=function(){
	if (inputImage.width>inputImage.height){
		referenceCanvas.setSize(referenceCanvasBaseSize,
			                    Math.round(referenceCanvasBaseSize*inputImage.height/inputImage.width));
	}
	else {
		referenceCanvas.setSize(Math.round(referenceCanvasBaseSize*inputImage.width/inputImage.height),
			                    referenceCanvasBaseSize);
	}
	referenceCanvas.scaleFromInputImage=referenceCanvas.width/inputImage.width;
	referenceCanvas.canvasImage.drawImage(inputImage.image,0,0,referenceCanvas.width,referenceCanvas.height);
	referenceCanvas.createPixels();
}

// adjust size fitting to output image smaller dimension half of output
referenceCanvas.adjustToOutput=function(){
	var outputSize=outputWidthChooser.getValue()*0.5;   // reduced size
	if (inputImage.width<inputImage.height){
		referenceCanvas.setSize(outputSize,
			                    Math.round(outputSize*inputImage.height/inputImage.width));
	}
	else {
		referenceCanvas.setSize(Math.round(outputSize*inputImage.width/inputImage.height),
			                    outputSize);
	}
	referenceCanvas.scaleFromInputImage=referenceCanvas.width/inputImage.width;
	referenceCanvas.canvasImage.drawImage(inputImage.image,0,0,referenceCanvas.width,referenceCanvas.height);
	referenceCanvas.createPixels();
}
// adjust width fitting to input image and given height, draw new input, make pixels
referenceCanvas.adjustWidth=function(){
		referenceCanvas.setSize(Math.round(referenceCanvasHeight*inputImage.width/inputImage.height),
			                    referenceCanvasHeight);

	referenceCanvas.scaleFromInputImage=referenceCanvas.width/inputImage.width;
	referenceCanvas.canvasImage.drawImage(inputImage.image,0,0,referenceCanvas.width,referenceCanvas.height);
	referenceCanvas.createPixels();
	
	//console.log(" ref can height "+referenceCanvas.height)
	//referenceHeightChooser.setValue(referenceCanvas.height);
}




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
