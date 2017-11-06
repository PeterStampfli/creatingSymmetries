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
	this.canvasData=null;
	this.pixels=null;
	this.color=new Color();
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
}

/*
make a blue screen
*/
PixelCanvas.prototype.blueScreen=function(){
	this.canvasImage.fillStyle="Blue";
	this.canvasImage.fillRect(0,0,this.width,this.height);	
}


/*
create pixels
*/
PixelCanvas.prototype.createPixels=function(){
	this.canvasData=this.canvasImage.getImageData(0,0,this.width,this.height);
	this.pixels=this.canvasData.data;	
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

/*
put the pixels on canvas
*/
PixelCanvas.prototype.showPixels=function(){
	this.canvasImage.putImageData(this.canvasData,0,0);
}

/*
set alpha value of all pixels
*/
PixelCanvas.prototype.setAlpha=function(alpha){
	for (var i=this.pixels.length-1;i>0;i-=4){
		this.pixels[i]=alpha;
	}
}

/*
set alpha value of a pixel to 255
*/
PixelCanvas.prototype.setOpaquePixel=function(x,y){
	x=Math.round(x);
	y=Math.round(y);
    // but check if we are on the canvas, shift to multiply
    if ((x >= 0) && (x < this.width) && (y >= 0) && (y < this.height)) {
        this.pixels[((this.width * y + x)<<2) + 3] = 255;
    }	
}

/*
create a pixel 
Go through all pixels, 
call method that sets image.color object depending on the total index of the pixel
(will get data from a map related to the canvas)
makeColor(color,index)
*/
PixelCanvas.prototype.setPixels=function(makeColor){
	var color=this.color;
	var pixels=this.pixels;
	var index=this.width*this.height-1;
	for (var i=this.pixels.length-4;i>=0;i-=4){
		makeColor(color,index--);
		pixels[i]=color.red;
		pixels[i+1]=color.green;
		pixels[i+2]=color.blue;
	}
}

/*
example: test implementation
*/
PixelCanvas.prototype.makeColor=function(color,index){
	color.red=index/200;
	color.green=100;
	color.blue=0;
}

/*
periodic repetition of another canvas/image
*/
PixelCanvas.prototype.periodic=function(inputImage){

	for (var i=0;i<horizontalRepetitions;i++){
		for (var j=0;j<verticalRepetitions;j++){
			console.log("rep "+i+" "+j);
			console.log(i*inputImage.width-i);
			console.log(inputImage.width);
			this.canvasImage.drawImage(inputImage,i*inputImage.width,j*inputImage.height);
		}
	}
	
}