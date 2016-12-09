"use strict";

// draw the output image on the output canvas 
function simplePatchingDrawing(){
	if (!inputLoaded){						// no input means nothing to do
		return;
	}
	// draw the reference image
	// first draw the entire input image
	referenceImage.drawImage(inputImage,0,0,inputWidth,inputHeight,
							 0,0,referenceWidth,referenceHeight);
	// then mask, make that only the used part is fully visible
	//  symmetry dependent
	whiteOutsideBasicPatch();
	//================================	
	// mapping to the input image as defined by the mouse on the reference image
	var inputPatchHeight=scaleOutputToInput*patchHeight;
	var inputPatchWidth=scaleOutputToInput*patchWidth;
	var inputPatchCornerX=mouseX/scaleInputToReference-inputPatchWidth/2;
	var inputPatchCornerY=mouseY/scaleInputToReference-inputPatchHeight/2;
	// simply a direct copy of the input image, depending on scaling and position
	outputImage.drawImage(inputImage,inputPatchCornerX,inputPatchCornerY,
	                      inputPatchWidth,inputPatchHeight,
				          0,0,patchWidth,patchHeight);	
	// now get the pixels of the periodic unit cell	
	//  input image info has changed	
	getPixelsFromCanvas();
	// make the symmetries
	// symmetry dependent
	makeSymmetriesSimplePatching();
	//============================================
	// put the symmetric image on the output canvas
	putPixelsPeriodicallyOnCanvas();
	// hint for debugging
	showHintPatch();
}
