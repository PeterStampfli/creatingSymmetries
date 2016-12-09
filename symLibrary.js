"use strict";

//  canvases, their context
//======================================================
var outputCanvas;
var outputImage;
var referenceCanvas;
var referenceImage;

function getCanvases(){
	referenceCanvas=document.getElementById("referenceCanvas");	
	referenceImage=referenceCanvas.getContext("2d");
	outputCanvas=document.getElementById("canvas");	
	outputImage=outputCanvas.getContext("2d");
}

//  for image downloading, using jpeg image format, default quality=0.92
//=================================================================
var imageFilename='theImage.jpg';

function activateImageDownloadButton(){
	var downloadButton=document.getElementById('download');
	if (downloadButton!==null){
		downloadButton.addEventListener('click', function() {
			//  use correct data format and filename
			this.href = outputCanvas.toDataURL("image/jpeg");
			this.download = imageFilename;
		}, false);
	}
}

window.onload=function(){
	getCanvases();
	referenceCanvasAddEventListeners();
	activateImageDownloadButton();
	updateOutputDimensions(512,512);
	updatePeriod(256,256);
	drawing();

}
