"use strict";



//  switching on and off the hint for the patch
var hintPatch=false;

// using special symmetries
var squareSymmetry;
var hexagonSymmetry;

window.onload=function(){
	hintPatch=true;
	setSymmetries();
	connectNewInputImage();
	getCanvases();
	getChoosers();
	referenceCanvasAddEventListeners();
	outputCanvasAddEventListeners();
	setupOrientationCanvas(200);
	orientationCanvasAddEventListeners();
	activateDownloadButtons();
	updateOutputDimensions(512,512);
	updatePeriod(256,256);
	drawing();
}
