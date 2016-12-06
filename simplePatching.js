// white-out semitransparently the unused pixels on the reference canvas
//======================================================================
function whiteOutsideBasicPatch(){
	// scale the patch size: going from output canvas image to input image
	// and then to reference image
	var referencePatchWidth=patchWidth*scale*scaleInputToReferenceImage;
	var referencePatchHeight=patchHeight*scale*scaleInputToReferenceImage;
	//center around the mouse position
	var fromI=Math.max(0,Math.round(mouseX-referencePatchWidth/2));
	var toI=Math.min(referenceWidth-1,Math.round(mouseX+referencePatchWidth/2));
	var fromJ=Math.max(0,Math.round(mouseY-referencePatchHeight/2));
	var toJ=Math.min(referenceHeight-1,Math.round(mouseY+referencePatchHeight/2));
	//path around border
	referenceCanvasImage.fillStyle="rgba(255,255,255,0.5)";
	referenceCanvasImage.beginPath();
	referenceCanvasImage.moveTo(0,0);
	referenceCanvasImage.lineTo(referenceWidth,0);
	referenceCanvasImage.lineTo(referenceWidth,referenceHeight);
	referenceCanvasImage.lineTo(0,referenceHeight);
	referenceCanvasImage.lineTo(0,0);
	// now this depends on the symmetries
	// path around patch
	referenceCanvasImage.moveTo(fromI,fromJ);
	referenceCanvasImage.lineTo(fromI,toJ);
	referenceCanvasImage.lineTo(toI,toJ);
	referenceCanvasImage.lineTo(toI,fromJ);
	referenceCanvasImage.lineTo(fromI,fromJ);
	referenceCanvasImage.fill();	
}



// draw the output image on the canvas 
function simplePatchingDrawing(){
	canvas.width=width;
	canvas.height=height;
	canvasImage.fillStyle="Blue";	
	canvasImage.fillRect(0,0,width,height);
	setPatchDimensions();
	if (!inputImageLoaded){						// no input means nothing to do
		return;
	}
	simplePatchingReferenceDrawing();
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
function simplePatchingReferenceDrawing(){
	if (!inputImageLoaded){						// no input means nothing to do
		return;
	}
	// draw the entire input image
	referenceCanvasImage.drawImage(inputImage,0,0,inputImageWidth,inputImageHeight,
											  0,0,referenceWidth,referenceHeight);
	// make that only the used part is fully visible
	whiteOutsideBasicPatch();	
}
