"use strict";

// a canvas with pixel data and a framework for creating images
// with methods for changing the canvas size

/*
idName String, name of id in html document
(re)set size separately
*/
function PixelCanvas(idName){
	this.width=0;
	this.height=0;
	this.canvas=document.getElementById(idName);
	this.canvasImage=this.canvas.getContext('2d');
	this.pixels=null;
}

/*
set the size, and create pixels, inialize to blue screen of nirvana
*/
PixelCanvas.prototype.setSize=function(width,height){
	var canvasData;
	width=Math.round(width);
	height=Math.round(height);
	this.width=width;
	this.height=height;
	this.canvas.width=width;
	this.canvas.height=height;
	this.canvasImage.fillStyle="Blue";
	this.canvasImage.fillRect(0,0,width,height);
	canvasData=this.canvasImage.getImageData(0,0,width,height);
	this.pixels=canvasData.data;
}

/*
save the image as jpg, needs fileSaver.js
fileName String, name of file without extension
*/
PixelCanvas.prototype.saveImage=function(fileName){
	this.canvas.toBlob(function(blob){
		saveAs(blob,fileName+'.jpg');
	},'image/jpeg',0.92);
}
