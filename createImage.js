"use strict";

// function for creating the image

// adjust the output size and update the map


// test if output dimensions have changed: adjust output canvas and map
// make the output image 



function createImage(){
	console.log("createImage");

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
  		color.red=position.x;
  		color.green=position.y;
  		color.blue=0;
  		if ((position.x<0)&&(position.y<0)) color.blue=255;

  	})

  	outputCanvas.showPixels();
  	referenceCanvas.showPixels();

  	progressMessage();
}