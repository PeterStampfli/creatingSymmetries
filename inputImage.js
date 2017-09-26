"use strict";

// a single file reader
var fileReader=new FileReader();

// global reference to the input object
//var input;

/*
object for reading images and getting their pixels
*/

// we might want to read more than one single image

function InputImage(){
	this.image=null;
	this.width=0;
	this.height=0;
	this.pixels=null;
}

// we use an off-screen canvas to get the data of the input image
InputImage.prototype.makePixels=function(){
    var offScreenCanvas;
    var offScreenCanvasImage;
    var inputData;
    this.width=this.image.width;
    this.height=this.image.height;
    offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.width;
    offScreenCanvas.height = this.height;
    offScreenCanvasImage = offScreenCanvas.getContext("2d");
    offScreenCanvasImage.drawImage(this.image, 0, 0);
    inputData = offScreenCanvasImage.getImageData(0, 0, this.width, this.height);
    this.pixels = inputData.data;
}

/*
read an image from a file and do some action
*/
InputImage.prototype.read=function(file,action){
	var input=this;
	this.image=new Image();
	this.pixels=null;
	this.image.onload=function(){
		input.width=input.image.width;
		input.height=input.image.height;
		input.makePixels();
		action(input);
	};
	fileReader.onload=function(){
		input.image.src=fileReader.result;
	};
	fileReader.readAsDataURL(file);
}

