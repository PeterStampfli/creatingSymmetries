// white-out semitransparently the unused pixels on the reference canvas
//======================================================================
function whiteOutsideBasicPatch(){
	// scale the patch size: going from output canvas image to input image
	// and then to reference image
	var referencePatchWidth=patchWidth*scaleOutputToInput*scaleInputToReference;
	var referencePatchHeight=patchHeight*scaleOutputToInput*scaleInputToReference;
	//center around the mouse position
	var fromI=Math.max(0,Math.round(mouseX-referencePatchWidth/2));
	var toI=Math.min(referenceWidth-1,Math.round(mouseX+referencePatchWidth/2));
	var fromJ=Math.max(0,Math.round(mouseY-referencePatchHeight/2));
	var toJ=Math.min(referenceHeight-1,Math.round(mouseY+referencePatchHeight/2));
	//path around border
	referenceImage.fillStyle="rgba(255,255,255,0.5)";
	referenceImage.beginPath();
	referenceImage.moveTo(0,0);
	referenceImage.lineTo(referenceWidth,0);
	referenceImage.lineTo(referenceWidth,referenceHeight);
	referenceImage.lineTo(0,referenceHeight);
	referenceImage.lineTo(0,0);
	// now this depends on the symmetries
	// path around patch
	referenceImage.moveTo(fromI,fromJ);
	referenceImage.lineTo(fromI,toJ);
	referenceImage.lineTo(toI,toJ);
	referenceImage.lineTo(toI,fromJ);
	referenceImage.lineTo(fromI,fromJ);
	referenceImage.fill();	
}

//  make symmetries inside the unit cell
function makeSymmetriesSimplePatching(){
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
}


// draw the output image on the output canvas 
function simplePatchingDrawing(){
	outputCanvas.width=outputWidth;
	outputCanvas.height=outputHeight;
	outputImage.fillStyle="Blue";	
	outputImage.fillRect(0,0,outputWidth,outputHeight);
	if (!inputLoaded){						// no input means nothing to do
		return;
	}
	// draw the reference image
	// first draw the entire input image
	referenceImage.drawImage(inputImage,0,0,inputWidth,inputHeight,
							 0,0,referenceWidth,referenceHeight);
	// then mask, make that only the used part is fully visible
	whiteOutsideBasicPatch();	
	// mapping to the input image as defined by the mouse on the reference image
	var inputPatchHeight=scaleOutputToInput*patchHeight;
	var inputPatchWidth=scaleOutputToInput*patchWidth;
	var inputPatchCornerX=mouseX/scaleInputToReference-inputPatchWidth/2;
	var inputPatchCornerY=mouseY/scaleInputToReference-inputPatchHeight/2;
	// simply a direct copy of the input image
	outputImage.drawImage(inputImage,inputPatchCornerX,inputPatchCornerY,
	                      inputPatchWidth,inputPatchHeight,
				          0,0,patchWidth,patchHeight);	
	// now get the pixels of the periodic unit cell		
	getPixelsFromCanvas();
	// make the symmetries
	makeSymmetriesSimplePatching();
	// put the symmetric image on the output canvas
	putPixelsPeriodicallyOnCanvas();
	// hint for debugging
	showHintPatch();
}
