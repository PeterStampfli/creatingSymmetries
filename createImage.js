"use strict";

// get interpolated image pixel
// set the color depending on the given vector2 position
// mark reference pixel
// change color for color symmetries

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
		color.alpha=255;
	}
	else {
		colorSymmetry.makeSymmetry(color,colorPosition);
		color.alpha=255;
		averageSum++;
		averageRed+=color.red;
		averageGreen+=color.green;		
		averageBlue+=color.blue;
	}
}
// function for creating the image

// adjust the output size and update the map


// test if output dimensions have changed: adjust output canvas and map
// make the output image 

var averageRed;
var averageGreen;
var averageBlue;
var averageSum;

function createImage(){
	if (inputImage.pixels==null){                    // no input image, no output
		return;
	}
	// do resize tasks if output is resized
	var width=outputWidthChooser.getValue();
	var height=width;
	
	/*
	
	referenceCanvasHeight=referenceHeightChooser.getValue();
	
	if (referenceCanvasHeight!=referenceCanvas.height){
	referenceCanvas.adjustWidth();
	console.log("adjust height");
	
	}
	*/
	
		referenceCanvas.adjustWidth();
		
		backgroundRed=backgroundRedChooser.getValue();
		backgroundGreen=backgroundGreenChooser.getValue();	
		backgroundBlue=backgroundBlueChooser.getValue();
		backgroundColor.setRgb(backgroundRed,backgroundGreen,backgroundBlue);
	
  	if ((width!=outputCanvas.width)||(height!=outputCanvas.height)){
		outputCanvas.setSize(width,height);
	  //	finalCanvas.setSize(horizontalRepetitions*(width-1),verticalRepetitions*(height-1));
		outputCanvas.blueScreen();
		outputCanvas.createPixels();
		//referenceCanvas.adjustToOutput();
	  	map.setSize(width,height);
	  //	finalCanvas.setSize(2*width,2*height);
	  	//finalCanvas.blueScreen();
  	}
  	totalMap();
  	referenceCanvas.setAlpha(128);
  	
  	averageRed=0;
  	averageGreen=0;
  	averageBlue=0;
  	averageSum=0;
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
  	averageRed=Math.round(averageRed/averageSum);
  	averageGreen=Math.round(averageGreen/averageSum);
  	averageBlue=Math.round(averageBlue/averageSum);
  	colorMessage(averageRed,averageGreen,averageBlue);
}

// make the pixels without averaging
// new objects are created only once for the full image
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
        if (positionValid[mapIndex]){
	        colorPosition.x=colorPositionX[mapIndex];
	        colorPosition.y=colorPositionY[mapIndex];
	        imagePosition.x=imagePositionX[mapIndex];
	        imagePosition.y=imagePositionY[mapIndex];
           makeColor(color,colorPosition,imagePosition);
        }
        else {
        	color.set(backgroundColor);
        	color.alpha=255;
        }
        outputPixels[outputIndex++]=color.red;
        outputPixels[outputIndex++]=color.green;
        outputPixels[outputIndex++]=color.blue;
        outputPixels[outputIndex++]=color.alpha;
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
			if (positionValid[baseIndex]){
				baseImagePositionX=imagePositionX[baseIndex];
				baseImagePositionY=imagePositionY[baseIndex];
				baseColorPositionX=colorPositionX[baseIndex];
				baseColorPositionY=colorPositionY[baseIndex];
				imagePosition.x=baseImagePositionX;
				imagePosition.y=baseImagePositionY;
				colorPosition.x=baseColorPositionX;
				colorPosition.y=baseColorPositionY;
				makeColor(baseColor,colorPosition,imagePosition);
				if (positionValid[indexPlusX]){
					imagePosition.x=0.5*(baseImagePositionX+imagePositionX[indexPlusX]);
					imagePosition.y=0.5*(baseImagePositionY+imagePositionY[indexPlusX]);
					colorPosition.x=0.5*(baseColorPositionX+colorPositionX[indexPlusX]);
					colorPosition.y=0.5*(baseColorPositionY+colorPositionY[indexPlusX]);
					makeColor(colorPlusX,colorPosition,imagePosition);
				}
				else {
					colorPlusX.set(backgroundColor);
				}
				if (positionValid[indexPlusY]){
					imagePosition.x=0.5*(baseImagePositionX+imagePositionX[indexPlusY]);
					imagePosition.y=0.5*(baseImagePositionY+imagePositionY[indexPlusY]);
					colorPosition.x=0.5*(baseColorPositionX+colorPositionX[indexPlusY]);
					colorPosition.y=0.5*(baseColorPositionY+colorPositionY[indexPlusY]);
					makeColor(colorPlusY,colorPosition,imagePosition);
				}
				else {
					colorPlusY.set(backgroundColor);
				}
				if (positionValid[indexPlusXY]){
					imagePosition.x=0.5*(baseImagePositionX+imagePositionX[indexPlusXY]);
					imagePosition.y=0.5*(baseImagePositionY+imagePositionY[indexPlusXY]);
					colorPosition.x=0.5*(baseColorPositionX+colorPositionX[indexPlusXY]);
					colorPosition.y=0.5*(baseColorPositionY+colorPositionY[indexPlusXY]);
					makeColor(colorPlusXY,colorPosition,imagePosition);
				}
				else {
					colorPlusXY.set(backgroundColor);
				}
				outputPixels[outputIndex++]=(2+baseColor.red+colorPlusX.red+colorPlusY.red+colorPlusXY.red)>>2;
				outputPixels[outputIndex++]=(2+baseColor.green+colorPlusX.green+colorPlusY.green+colorPlusXY.green)>>2;
				outputPixels[outputIndex++]=(2+baseColor.blue+colorPlusX.blue+colorPlusY.blue+colorPlusXY.blue)>>2;
				outputPixels[outputIndex++]=(2+baseColor.alpha+colorPlusX.alpha+colorPlusY.alpha+colorPlusXY.alpha)>>2;
			}
			else {
				outputPixels[outputIndex++]=backgroundColor.red;
				outputPixels[outputIndex++]=backgroundColor.green;
				outputPixels[outputIndex++]=backgroundColor.blue;
				outputPixels[outputIndex++]=255;
			}
			baseIndex++;
			indexPlusY++;			
		}

	}




}