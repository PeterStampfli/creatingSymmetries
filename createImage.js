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
	if (smoothing){
		smoothedPixels();
	}
	else {
		simplePixels();
	}
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
	var mapSize=map.width*map.height;
    for (mapIndex=0;mapIndex<mapSize;mapIndex++){
        // translation, rotation and scaling
        makeColor(color,colorPositions[mapIndex],inputImagePositions[mapIndex]);
        outputPixels[outputIndex++]=color.red;
        outputPixels[outputIndex++]=color.green;
        outputPixels[outputIndex]=color.blue;
        outputIndex += 2;
    }
}

// 2x2 averaging
function smoothedPixels(){
	var inputImagePositions=map.inputImagePositions;
	var colorPositions=map.colorPositions;

	var baseImagePosition;
	var baseColorPosition;
	var imagePosition=new Vector2();
	var colorPosition=new Vector2();
	var baseColor=new Color();
	var colorPlusX=new Color();
	var colorPlusY=new Color();
	var colorPlusXY=new Color();

	var outputPixels=outputCanvas.pixels;
    var outputIndex=0;

	var i,j;
	var height=map.height;
	var width=map.width;

	var baseIndex=0;
	var indexPlusX,indexPlusY,indexPlusXY;


	for (j=0;j<height;j++){
		if (j==height-1){                  // at top pixels beware of out of bounds indices
			indexPlusY=baseIndex;
		}
		else {
			indexPlusY=baseIndex+width;
		}
				

		for (i=0;i<width;i++){
			if (i<width-1){             // at right pixels beware of out of bounds indices
				indexPlusX=baseIndex+1;
				indexPlusXY=indexPlusY+1;
			}
	
			baseImagePosition=inputImagePositions[baseIndex];
			baseColorPosition=colorPositions[baseIndex];

			makeColor(baseColor,baseColorPosition,baseImagePosition);


			makeColor(colorPlusX,colorPosition.average(baseColorPosition,colorPositions[indexPlusX]),
								 imagePosition.average(baseImagePosition,inputImagePositions[indexPlusX]));
			makeColor(colorPlusY,colorPosition.average(baseColorPosition,colorPositions[indexPlusY]),
								 imagePosition.average(baseImagePosition,inputImagePositions[indexPlusY]));
			makeColor(colorPlusXY,colorPosition.average(baseColorPosition,colorPositions[indexPlusXY]),
								 imagePosition.average(baseImagePosition,inputImagePositions[indexPlusXY]));

			outputPixels[outputIndex++]=(2+baseColor.red+colorPlusX.red+colorPlusY.red+colorPlusXY.red)>>2;
			outputPixels[outputIndex++]=(2+baseColor.green+colorPlusX.green+colorPlusY.green+colorPlusXY.green)>>2;
			outputPixels[outputIndex]=(2+baseColor.blue+colorPlusX.blue+colorPlusY.blue+colorPlusXY.blue)>>2;


	        outputIndex += 2;
			baseIndex++;
			indexPlusY++;			
		}

	}




}