



// set the canvas size, make a blue background and write the image on it (scale 100%)
function startDrawing(){
	canvas.width=width;
	canvas.height=height;
	canvasImage.fillStyle="Blue";	
	canvasImage.fillRect(0,0,width,height);
	if (inputImageLoaded){
		//canvasImage.drawImage(inputImage,0,0);
		canvasImage.putImageData(inputImageData,0,0);

		startReferenceDrawing();
	}
	getPixelsFromCanvas();
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
	periodic();
	putPixelsOnCanvas();
	
	
	canvasImage.strokeStyle="Red";	
	canvasImage.strokeRect(0,0,periodWidth,periodHeight);
	
}

// set the reference canvas size, and write the image on it
function startReferenceDrawing(){
	if (inputImageLoaded){
		referenceCanvasImage.drawImage(inputImage,0,0,inputImageWidth,inputImageHeight,
		                                          0,0,referenceWidth,referenceHeight);
		getPixelsFromReferenceCanvas();
		//  black-out used pixels ??, or whatever
		setAlphaReferenceImagePixels(128);
		for (var i=0;i<inputImageWidth/2;i++){
			for (var j=0;j<inputImageHeight/2;j++){
			
				setOpaqueReferenceImagePixelFromInputImage(i,j);
			}
		}
		
		
		putPixelsOnReferenceCanvas();
	}
}


// on loading the page: get canvas and canvas context
// create image download function, using jpeg image format,default quality=0.92
// start drawing

window.onload=function(){
	getCanvases();
	activateImageDownloadButton();
	drawing();
	console.log(5/2);
	var c=color();
	c.red=9;
	c.blue=8;
	console.log(c.green);
}
