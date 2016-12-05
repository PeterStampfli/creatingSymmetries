// a mapping function (i,j) -> float (x,y) in a table
var mapWidth=1;
var mapHeight=1;
var mapX=new Array(mapWidth*mapHeight);     // change mapX.length as needed
var mapY=new Array(mapWidth*mapHeight);     // change mapX.length as needed

// mapping from (x,y) to inputImagePixels:
// (mouseX,mouseY) on reference canvas to centerX=mouseX/scaleInputToReferenceImage, centerY
// (x,y) -> (centerX+scale*x,centerY+scale*y)
// need a scaling from canvasimage to inputImage ???
// do that later (changing resolution)

//  primitive copy-paste method


// draw an image line on canvas
// (i,j), i=fromI ... toI,
// using a rectangle function value map(i,j) with given mapWidth
function drawImagePixelLine(fromI,toI,j){
	var atPixelIndex=index(fromI,j);
	var atMapIndex=fromI+j*mapWidth;
	var pixel=new Color(0,255,0);
	var x,y;
	for (var i=fromI;i<=toI;i++){
		
		// mapX(atMapIndex)...
		//..... some mapping function
		x=i;
		y=j;
		// scale and shift around
		
		//  get color of some pixel  define color.method ...
		
		//  put it on canvas pixels
		
		
		
		imagePixels[atPixelIndex++]=pixel.red;
		imagePixels[atPixelIndex++]=pixel.green;
		imagePixels[atPixelIndex++]=pixel.blue;

		atPixelIndex++;    //skip alpha
		atMapIndex++;

	}
	
}



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
	
	drawImagePixelLine(0,90,100);
	
	
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
		for (var i=0;i<periodWidth/2;i++){
			for (var j=0;j<periodHeight/2;j++){
			
				setOpaqueReferenceImagePixelFromInputImage(i,j);
			}
		}
		
		
		putPixelsOnReferenceCanvas();
		referenceCanvasImage.strokeStyle="red";
		if (mousePressed){
			referenceCanvasImage.strokeStyle="yellow";
		}
		referenceCanvasImage.strokeRect(mouseX,mouseY,20*scale,20*scale);
	}
}


// on loading the page: delete warnings, get canvas and canvas context
// create image download function, start drawing

window.onload=function(){
	deleteWarning();
	deleteWarning();
	getCanvases();
	referenceCanvasAddEventListeners();
	activateImageDownloadButton();
	drawing();
}
