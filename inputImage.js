"use strict";

// a single file reader
var fileReader=new FileReader();

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
free the image for garbage collection
*/
InputImage.prototype.deleteImage=function(){
	this.image=null;
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

/*
get color of nearest pixel
this.red=-1 for pixels lying outside
*/
InputImage.prototype.getNearest=function(color,x,y){
    var h = Math.round(x);
    var k = Math.round(y);
    if ((h<0)||(h>=this.width)||(k<0)||(k>=this.height)){
    	color.red=-1;
    }
    else {
    	var index=(h+this.width*k)<<2;    // shift - multiply with four
    	color.red=this.pixels[index++];
    	color.green=this.pixels[index++];
    	color.blue=this.pixels[index];
    }
}