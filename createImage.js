"use strict";

// get interpolated image pixel
// set the color depending on the given vector2 position
// mark reference pixel
// change color for color symmetries

function makeColor(color,colorPosition,inputImagePosition){
	var x=inputTransform.scaleRotateShiftX(inputImagePosition);
	var y=inputTransform.scaleRotateShiftY(inputImagePosition);
	referenceCanvas.setOpaquePixel(x*referenceCanvas.scaleFromInputImage,
		                           y*referenceCanvas.scaleFromInputImage);
	inputImage.interpolation(color,x,y);
	if (color.red<0){
		color.set(backgroundColor);
	}
}
// function for creating the image

// adjust the output size and update the map


// test if output dimensions have changed: adjust output canvas and map
// make the output image 



function createImage(){
	if (inputImage.pixels==null){                    // no input image, no output
		return;
	}
	// do necessary if output is resized
  	if ((outputWidthChooser.getValue()!=outputCanvas.width)||(outputHeightChooser.getValue()!=outputCanvas.height)){
		outputCanvas.setSize(outputWidthChooser.getValue(),outputHeightChooser.getValue());
		outputCanvas.blueScreen();
		outputCanvas.createPixels();
	  	map.setSize(outputWidthChooser.getValue(),outputHeightChooser.getValue());
  	}
	map.make(mappingFunction);                    // recalculates only if necessary

  	//outputCanvas.canvasImage.drawImage(inputImage.image,0,0);
  	referenceCanvas.setAlpha(128);
/*
  	outputCanvas.setPixels(function(color,index){

  		var position=map.inputImagePositions[index];
  		getInputColor(color,position);


  	})
*/
	simplePixels();
  	outputCanvas.showPixels();
  	referenceCanvas.showPixels();

  	progressMessage();
}

// make the pixels without averaging
function simplePixels(){
	var inputImagePositions=map.inputImagePositions;
	var colorPositions=map.colorPositions;
	var outputPixels=outputCanvas.pixels;
	var color=new Color();
    var outputIndex=0;
    var mapIndex=0;
	var mapSize=inputImagePositions.length;
    for (mapIndex=0;mapIndex<mapSize;mapIndex++){
        // translation, rotation and scaling
        makeColor(color,colorPositions[mapIndex],inputImagePositions[mapIndex]);

        outputPixels[outputIndex++]=color.red;
        outputPixels[outputIndex++]=color.green;
        outputPixels[outputIndex]=color.blue;
        outputIndex += 2;
    }
	

}
