"use strict";

//  canvases, their context
//======================================================
var outputCanvas;
var outputImage;
var referenceCanvas;
var referenceImage;
var orientationCanvas;
var orientationImage;

// image and pixel data of output canvas, using only one periodic unit cell
var outputData;
var outputPixels;
// image and pixel data of the reference canvas
var referenceData;
var referencePixels;


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
var htmlFilename='caleidoscope.html';
var cssFilename='caleidoscope.css';
var jsFilename='caleidoscope.js';

function activateDownloadButtons(){
	function addDownload(button,filename){
		button.addEventListener('click', function() {
			this.href = filename;
			this.download = filename;
		}, false);
	}
	var downloadImageButton=document.getElementById('downloadImageButton');
	downloadImageButton.addEventListener('click', function() {
		//  use correct data format and filename
		this.href = outputCanvas.toDataURL("image/jpeg");  // this needs to be done live at click
		this.download = imageFilename;
	}, false);
	addDownload(document.getElementById('downloadHTMLButton'),htmlFilename);
	addDownload(document.getElementById('downloadCSSButton'),cssFilename);
	addDownload(document.getElementById('downloadJSButton'),jsFilename);
}



//  switching on and off the hint for the patch
var hintPatch=false;

// using special symmetries
var squareSymmetry;
var hexagonSymmetry;

window.onload=function(){
	hintPatch=true;
	setSymmetries();
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
	console.log("333");
}
