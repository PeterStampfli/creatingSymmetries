// color object
function Color(red,green,blue){
	this.red=red;
	this.green=green;
	this.blue=blue;
}

function color(){
	return new Color(0,0,0);
}





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

function showPatch(){
		
	canvasImage.strokeStyle="Red";	
	canvasImage.strokeRect(0,0,patchWidth,patchHeight);
}


// set the canvas size, make a blue background and write the image on it 
function startDrawing(){
	canvas.width=width;
	canvas.height=height;
	canvasImage.fillStyle="Blue";	
	canvasImage.fillRect(0,0,width,height);
	setPatchDimensions();
	if (inputImageLoaded){
		//console.log(patchWidth);
		//canvasImage.drawImage(inputImage,0,0);
		//canvasImage.putImageData(inputImageData,0,0);
		
		// interactive patch
		var inputPatchHeight=scale*patchHeight;
		var inputPatchWidth=scale*patchWidth;
		var inputPatchCornerX=mouseX/scaleInputToReferenceImage-inputPatchWidth/2;
		var inputPatchCornerY=mouseY/scaleInputToReferenceImage-inputPatchHeight/2;
		
		canvasImage.drawImage(inputImage,inputPatchCornerX,inputPatchCornerY,inputPatchWidth,inputPatchHeight,
							0,0,patchWidth,patchHeight);
		startReferenceDrawing();
	}
// get the pixels and make symmetries

//  use only the periodic cell !!!!	
		
	getPixelsFromCanvas();
	
	
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
	//periodic();
	 
	 
	putPixelsPeriodicallyOnCanvas();
	showPatch();
}

// set the reference canvas size, and write the image on it
function startReferenceDrawing(){
	if (inputImageLoaded){
		// draw the input image on scale
		referenceCanvasImage.drawImage(inputImage,0,0,inputImageWidth,inputImageHeight,
		                                          0,0,referenceWidth,referenceHeight);
		// make that only the used part is opaque and fully visible
		/*
		 * for general mapping
		  getPixelsFromReferenceCanvas();
		setAlphaReferenceImagePixels(128);
		
		opaqueBasicPatch();
		
		putPixelsOnReferenceCanvas();
		 */
		
		whiteOutsideBasicPatch();
		
	}
}


// on loading the page: delete warnings, get canvas and canvas context
// create image download function, start drawing

window.onload=function(){
//	deleteWarning();
	getCanvases();
	referenceCanvasAddEventListeners();
	activateImageDownloadButton();
	drawing();
}
