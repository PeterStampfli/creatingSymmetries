"use strict";

// background color, for hitting outside
var backgroundColor=new Color;
backgroundColor.setRgb(100,100,100);

// get interpolated image pixel
// set the color depending on the given vector2 position
// mark reference pixel
function getInputColor(color,position){
	var x=inputTransform.scaleRotateShiftX(position);
	var y=inputTransform.scaleRotateShiftY(position);
	referenceCanvas.setOpaquePixel(x*referenceCanvas.scaleFromInputImage,
		                           y*referenceCanvas.scaleFromInputImage);
	inputImage.interpolation(color,x,y);

}
// function for creating the image

// adjust the output size and update the map


// test if output dimensions have changed: adjust output canvas and map
// make the output image 



function createImage(){
	console.log("createImage");
	if (inputImage.pixels==null){                    // no input image, no output
		return;
	}
	// do necessary if output is resized
  	if ((outputWidthChooser.getValue()!=outputCanvas.width)||(outputHeightChooser.getValue()!=outputCanvas.height)){
		outputCanvas.setSize(outputWidthChooser.getValue(),outputHeightChooser.getValue());
		outputCanvas.blueScreen();
		outputCanvas.createPixels();
	  	map.setSize(outputWidthChooser.getValue(),outputHeightChooser.getValue());
	  	map.make(mappingFunction);
  	}

  	//outputCanvas.canvasImage.drawImage(inputImage.image,0,0);
  	referenceCanvas.setAlpha(128);

  	outputCanvas.setPixels(function(color,index){

  		var position=map.inputImagePositions[index];
  		getInputColor(color,position);
  		if (color.red<0){
  			color.set(backgroundColor);
  		}


  	})

  	outputCanvas.showPixels();
  	referenceCanvas.showPixels();

  	progressMessage();
}