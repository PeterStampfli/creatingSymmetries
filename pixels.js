"use strict";

// pixel data of canvas, using only one periodic unit cell
var outputData;
var outputPixels;
// get the pixels of the output canvas,use only the unit cell
function getPixelsFromCanvas(){
	outputData = outputImage.getImageData(0,0,periodWidth,periodHeight);
	outputPixels = outputData.data;
}

//  put pixels periodically on canvas
//  with offset
function putPixelsPeriodicallyOnCanvas(){
	var copyWidth;
	var copyHeight;
	var targetX;
	var targetY;
	var sourceX;
	var sourceY;
	for (var cornerY=outputOffsetY-periodHeight;cornerY<outputHeight;cornerY+=periodHeight){
		if (cornerY<0){
			sourceY=-cornerY;
			targetY=cornerY;      // strange, actually difference between source corner and intended
			//sourceY=0;
			copyHeight=outputOffsetY;
		}
		else {
			sourceY=0;
			targetY=cornerY;
			copyHeight=Math.min(outputHeight-cornerY,periodHeight);
		}
		for (var cornerX=outputOffsetX-periodWidth;cornerX<outputWidth;cornerX+=periodWidth){
			if (cornerX<0){
				sourceX=-cornerX;
				targetX=cornerX;
				copyWidth=outputOffsetX;			
			}
			else {			
				sourceX=0;
				targetX=cornerX;
				copyWidth=Math.min(outputWidth-cornerX,periodWidth);
			}
			outputImage.putImageData(outputData, 
			                         targetX, targetY,sourceX,sourceY,copyWidth,copyHeight);
		}
	}
}

	
