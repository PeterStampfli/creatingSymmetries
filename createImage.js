"use strict";

// get interpolated image pixel
// set the color depending on the given vector2 position
// mark reference pixel
// change color for color symmetries
// call only if position is valid

var makeColorPosition=new Vector2();

function makeColor(color,colorPosition,inputImagePosition){
	var x=inputTransform.scaleRotateShiftX(inputImagePosition);
	var y=inputTransform.scaleRotateShiftY(inputImagePosition);
	var position=makeColorPosition;
	position.set(inputImagePosition);
	inputTransform.scaleRotateShift(position);



	referenceCanvas.setOpaquePixel(position.x*referenceCanvas.scaleFromInputImage,
		                           position.y*referenceCanvas.scaleFromInputImage);
	inputImage.interpolation(color,position.x,position.y);
	if (color.red<0){
		color.set(backgroundColor);
	}
	else {
		colorSymmetry.makeSymmetry(color,colorPosition);
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
	// do resize tasks if output is resized
	var width=outputWidthChooser.getValue();
	var height=outputHeightChooser.getValue();
  	if ((width!=outputCanvas.width)||(height!=outputCanvas.height)){
		outputCanvas.setSize(width,height);
	  	finalCanvas.setSize(horizontalRepetitions*(width-1),verticalRepetitions*(height-1));
		outputCanvas.blueScreen();
		outputCanvas.createPixels();
	  	map.setSize(width,height);
	  //	finalCanvas.setSize(2*width,2*height);
	  	//finalCanvas.blueScreen();
  	}
  	totalMap();
  	referenceCanvas.setAlpha(128);
	if (smoothing){
		smoothedPixels();
	}
	else {
		simplePixels();
	}
  	outputCanvas.showPixels();
  	referenceCanvas.showPixels();
  //	finalCanvas.periodic(outputCanvas.canvas);
  	progressMessage();
}

// make the pixels without averaging
function simplePixels(){
	var imagePositionX=map.imagePositionX;
	var imagePositionY=map.imagePositionY;
	var imagePosition=new Vector2();
	var colorPositionX=map.colorPositionX;
	var colorPositionY=map.colorPositionY;
	var colorPosition=new Vector2();
	var positionValid=map.positionValid;
	var outputPixels=outputCanvas.pixels;
	var color=new Color();
    var outputIndex=0;
    var mapIndex=0;
	var mapSize=map.width*map.height;
    for (mapIndex=0;mapIndex<mapSize;mapIndex++){
        // translation, rotation and scaling
        colorPosition.x=colorPositionX[mapIndex];
        colorPosition.y=colorPositionY[mapIndex];
        colorPosition.valid=true;

        imagePosition.x=imagePositionX[mapIndex];
        imagePosition.y=imagePositionY[mapIndex];
        imagePosition.valid=positionValid[mapIndex];

        makeColor(color,colorPosition,imagePosition);


        outputPixels[outputIndex++]=color.red;
        outputPixels[outputIndex++]=color.green;
        outputPixels[outputIndex]=color.blue;
        outputIndex += 2;
    }
}

// 2x2 averaging
function smoothedPixels(){
	var imagePositionX=map.imagePositionX;
	var imagePositionY=map.imagePositionY;
	var imagePosition=new Vector2();
	var colorPositionX=map.colorPositionX;
	var colorPositionY=map.colorPositionY;
	var colorPosition=new Vector2();
	var positionValid=map.positionValid;

	var baseImagePositionX;
	var baseImagePositionY;
	var baseColorPositionX;
	var baseColorPositionY;

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
	
			baseImagePositionX=imagePositionX[baseIndex];
			baseImagePositionY=imagePositionY[baseIndex];
			baseColorPositionX=colorPositionX[baseIndex];
			baseColorPositionY=colorPositionY[baseIndex];

			imagePosition.x=baseImagePositionX;
			imagePosition.y=baseImagePositionY;
			colorPosition.x=baseColorPositionX;
			colorPosition.y=baseColorPositionY;

			makeColor(baseColor,colorPosition,imagePosition);


			imagePosition.x=0.5*(baseImagePositionX+imagePositionX[indexPlusX]);
			imagePosition.y=0.5*(baseImagePositionY+imagePositionY[indexPlusX]);
			colorPosition.x=0.5*(baseColorPositionX+colorPositionX[indexPlusX]);
			colorPosition.y=0.5*(baseColorPositionY+colorPositionY[indexPlusX]);

			makeColor(colorPlusX,colorPosition,imagePosition);


			imagePosition.x=0.5*(baseImagePositionX+imagePositionX[indexPlusY]);
			imagePosition.y=0.5*(baseImagePositionY+imagePositionY[indexPlusY]);
			colorPosition.x=0.5*(baseColorPositionX+colorPositionX[indexPlusY]);
			colorPosition.y=0.5*(baseColorPositionY+colorPositionY[indexPlusY]);

			makeColor(colorPlusY,colorPosition,imagePosition);


			imagePosition.x=0.5*(baseImagePositionX+imagePositionX[indexPlusXY]);
			imagePosition.y=0.5*(baseImagePositionY+imagePositionY[indexPlusXY]);
			colorPosition.x=0.5*(baseColorPositionX+colorPositionX[indexPlusXY]);
			colorPosition.y=0.5*(baseColorPositionY+colorPositionY[indexPlusXY]);

			makeColor(colorPlusXY,colorPosition,imagePosition);



			outputPixels[outputIndex++]=(2+baseColor.red+colorPlusX.red+colorPlusY.red+colorPlusXY.red)>>2;
			outputPixels[outputIndex++]=(2+baseColor.green+colorPlusX.green+colorPlusY.green+colorPlusXY.green)>>2;
			outputPixels[outputIndex]=(2+baseColor.blue+colorPlusX.blue+colorPlusY.blue+colorPlusXY.blue)>>2;


	        outputIndex += 2;
			baseIndex++;
			indexPlusY++;			
		}

	}




}