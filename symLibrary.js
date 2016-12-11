"use strict";

//  canvases, their context
//======================================================
var outputCanvas;
var outputImage;
var referenceCanvas;
var referenceImage;
var orientationCanvas;
var orientationImage;

function getCanvases(){
	referenceCanvas=document.getElementById("referenceCanvas");	
	referenceImage=referenceCanvas.getContext("2d");
	outputCanvas=document.getElementById("outputCanvas");	
	outputImage=outputCanvas.getContext("2d");
	orientationCanvas=document.getElementById("orientationCanvas");	
	orientationImage=orientationCanvas.getContext("2d");
}

//  for image downloading, using jpeg image format, default quality=0.92
//=================================================================
var imageFilename='theImage.jpg';

function activateImageDownloadButton(){
	var downloadImageButton=document.getElementById('downloadImageButton');
	if (downloadImageButton!==null){
		downloadImageButton.addEventListener('click', function() {
			//  use correct data format and filename
			this.href = outputCanvas.toDataURL("image/jpeg");
			this.download = imageFilename;
		}, false);
	}
}

window.onload=function(){
	getCanvases();
	getChoosers();
	referenceCanvasAddEventListeners();
	outputCanvasAddEventListeners();
	setupOrientationCanvas(200);
	orientationCanvasAddEventListeners();
	activateImageDownloadButton();
	updateOutputDimensions(512,512);
	updatePeriod(256,256);
	drawing();
}
