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
function putPixelsPeriodicallyOnCanvas(){
	var copyWidth;
	var copyHeight;
	for (var cornerY=0;cornerY<outputHeight;cornerY+=periodHeight){
		copyHeight=Math.min(outputHeight-cornerY,periodHeight);
		for (var cornerX=0;cornerX<outputWidth;cornerX+=periodWidth){
			copyWidth=Math.min(outputWidth-cornerX,periodWidth);
			outputImage.putImageData(outputData, cornerX, cornerY,
			                         0,0,copyWidth,copyHeight);
		}
	}
}

	
