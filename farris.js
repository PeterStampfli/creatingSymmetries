
//  sampling quality
var NEXT=0;
var LINEAR=1;

var quality=NEXT;            // chooser ???

// draw a line of pixels on the canvas
function drawPixelLine(fromI,toI,j){
	// local variables for acceleration
	// center of sampling as defined by the mouse on the reference image
	var centerX=mouseX/scaleInputToReferenceImage;
	var centerX=mouseX/scaleInputToReferenceImage;
	var theScale=scale;
	// input image
	var theInputImageWidth=inputImageWidth;
	var theInputImageHeight=inputImageHeight;
	//  period sizes
	var thePeriodWidth=periodWidth;
	var thePeriodHeigth=periodHeight;
	
	
	//  sampling coordinates
	var x,y;
	//  integer part of sampling coordinates
	var h,k;
	var inputImageIndex;
	// resulting color components
	var red,green,blue;
	
	var canvasPixelIndex=index(fromI,j);

	for (var i=fromI;i<=toI;i++){
		// some mapping from (i,j) to (x,y)
		// to define later, symmetry dependent
		// trivial default, equivalent to simple patching
		x=i;
		y=j;
		// now going to the input image
		x=theScale*x+centerX;
		y=theScale*y+centerY;
		if (quality==NEXT){
			h=Math.max(0,Math.min(theInputImageWidth,Math.round(x)));
			k=Math.max(0,Math.min(theInputImageHeight,Math.round(y)));
			inputImageIndex=4*(k*theInputImageWidth+h);
		}
		
		
		
		
		canvasPixelIndex++;    //skip alpha

	}
	
}


// draw the output image on the canvas 
function farrisDrawing(){
	canvas.width=width;
	canvas.height=height;
	canvasImage.fillStyle="Blue";	
	canvasImage.fillRect(0,0,width,height);
	setPatchDimensions();
	if (!inputImageLoaded){						// no input means nothing to do
		return;
	}
	referenceDrawing();
	// mapping to the input image as defined by the mouse on the reference image
	var inputPatchHeight=scale*patchHeight;
	var inputPatchWidth=scale*patchWidth;
	var inputPatchCornerX=mouseX/scaleInputToReferenceImage-inputPatchWidth/2;
	var inputPatchCornerY=mouseY/scaleInputToReferenceImage-inputPatchHeight/2;
	// simply a direct copy of the input image
	canvasImage.drawImage(inputImage,inputPatchCornerX,inputPatchCornerY,inputPatchWidth,inputPatchHeight,
						0,0,patchWidth,patchHeight);	
	// now get the pixels of the periodic unit cell		
	getPixelsFromCanvas();
	// and make the symmetries
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
	// put the symmetric image on the canvas
	putPixelsPeriodicallyOnCanvas();
	// hint for debugging
	showPatch();
}

// draw the reference image
function referenceDrawing(){
	if (!inputImageLoaded){						// no input means nothing to do
		return;
	}
	// draw the entire input image
	referenceCanvasImage.drawImage(inputImage,0,0,inputImageWidth,inputImageHeight,
											  0,0,referenceWidth,referenceHeight);
	// make that only the used part is fully visible
	//whiteOutsideBasicPatch();	
}



