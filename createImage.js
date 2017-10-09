"use strict";

// function for creating the image

// test if output dimensions have changed: adjust output canvas and map
// make the output image 

  function createImage(){

  	if ((outputWidthChooser.getValue()!=outputCanvas.width)||(outputHeightChooser.getValue()!=outputCanvas.height)){
  		outputCanvas.setSize(outputWidthChooser.getValue(),outputHeightChooser.getValue());
  	}

  	outputCanvas.canvasImage.drawImage(inputImage.image,0,0);
  	progressMessage();
  }