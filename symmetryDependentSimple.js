"use strict";

// white-out semitransparently the unused pixels on the reference canvas
//======================================================================
function whiteOutsideBasicPatch(){
	// scale the patch size: going from output canvas image to input image
	// and then to reference image
	var referencePatchWidth=patchWidth*scaleOutputToInput*scaleInputToReference;
	var referencePatchHeight=patchHeight*scaleOutputToInput*scaleInputToReference;
	//center is the mouse position
	//  coordinates of the corners of the rectangle
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

//  make symmetries inside the unit cell, after input image has been copied
function makeSymmetriesSimplePatching(){
	verticalMirror(periodHeight/2);
	horizontalMirror(periodWidth);
}
