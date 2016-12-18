"use strict";

//  put pixels periodically on canvas
//  with offset
// note that putImageData has different interface than drawImage
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
			targetY=cornerY;            // strange, actually difference between source corner and intended
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

	
