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
// the off-screen canvas is local to this function and should be garbage collected
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
read an image from a file, make its pixels and do some action (create output image)
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
from pixelInterpolation.js
*/

/*
get color of nearest pixel
*/
InputImage.prototype.getNearest=function(color,x,y){
    var h = Math.round(x);
    var k = Math.round(y);
    var index;
    if ((h<0)||(h>=this.width)||(k<0)||(k>=this.height)){
    	color.red=-1;
    }
    else {
    	index=(h+this.width*k)<<2;    // shift - multiply with four
    	color.red=this.pixels[index++];
    	color.green=this.pixels[index++];
    	color.blue=this.pixels[index];
    }
}

/*
get interpolated pixel color - linear interpolation
*/
InputImage.prototype.getLinear=function(color,x,y){
    var h = Math.round(x);
    var k = Math.round(y);
    var dx,dy;
    var i00, i01, i10, i11;
    var f00, f01, f10, f11;
    var inPixels;
    if ((h<0)||(h+1>=this.width)||(k<0)||(k+1>=this.height)){
    	color.red=-1;
    }
    else {
    dx = x - h;
    dy = y - k;
   	inPixels=this.pixels;
    // the indices to pixel data
    i00 = (h+this.width*k)<<2;
    i01 = i00+(this.width<<2);
    i10 = i00+4;
    i11 = i01+4;
    //  the weights
    f00 = (1 - dx) * (1 - dy);
    f01 = (1 - dx) * dy;
    f10 = dx * (1 - dy);
    f11 = dy * dx;
    // faster special method for rounding: BITwise or
   	color.red = 0|(0.5+f00 * inPixels[i00++] + f10 * inPixels[i10++] + f01 * inPixels[i01++] + f11 * inPixels[i11++]);
    color.green = 0|(0.5+f00 * inPixels[i00++] + f10 * inPixels[i10++] + f01 * inPixels[i01++] + f11 * inPixels[i11++]);
    color.blue = 0|(0.5+f00 * inPixels[i00] + f10 * inPixels[i10] + f01 * inPixels[i01] + f11 * inPixels[i11]);
    }
}

/*
get interpolated pixel color - cubic interpolation
*/
InputImage.prototype.kernel=function mitchellNetrovalli(x) { // Mitchell-Netrovali, B=C=0.333333, 0<x<2
    if (x < 1) {
        return (1.16666 * x - 2) * x * x + 0.888888;
    }
    return ((2 - 0.388888 * x) * x - 3.33333) * x + 1.777777;
}

InputImage.prototype.getCubic=function(color,x,y){
    var h = Math.round(x);
    var k = Math.round(y);
    var dx,dy;
    var indexM, index0, index1, index2;
    var width4;
    var kx,kym,ky0,ky1,ky2;
    var red,green,blue;
    var inPixels;
    var kernel;
    if ((h<1)||(h+2>=this.width)||(k<1)||(k+2>=this.height)){
    	pixelRed = -1;
    }
    else {
   		dx = x - h;
   		dy = y - k;
   		inPixels=this.pixels;
   		kernel=this.kernel;
	    // y (vertical position) dependent values
	    kym = kernel(1 + dy);
	    ky0 = kernel(dy);
	    ky1 = kernel(1 - dy);
	    ky2 = kernel(2 - dy);
    	// combined indices, for different heights at same x-position
    	width4=this.width<<2;
	    index0 = (this.width * k +h-1)<<2;
	    indexM = index0-width4;
	    index1 = index0+width4;
	    index2 = index1+width4;
	    kx = kernel(1 + dx);
	    red = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    green = kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    blue = kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
	    // the second column, just at the left of (x,y), skipping alpha
	    indexM +=2;
	    index0 +=2;
	    index1 +=2;
	    index2 +=2;
	    kx = kernel(dx);
	    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
	    //  the third column, just at the right of (x,y)
	    indexM +=2;
	    index0 +=2;
	    index1 +=2;
	    index2 +=2;
	    kx = kernel(1 - dx);
	    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
	    // the forth column
	    indexM +=2;
	    index0 +=2;
	    index1 +=2;
	    index2 +=2;
	    kx = kernel(2 - dx);
	    red += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    green += kx * (kym * inPixels[indexM++] + ky0 * inPixels[index0++] + ky1 * inPixels[index1++] + ky2 * inPixels[index2++]);
	    blue += kx * (kym * inPixels[indexM] + ky0 * inPixels[index0] + ky1 * inPixels[index1] + ky2 * inPixels[index2]);
	    // beware of negative values, with accelerated rounding
	    color.red = red>0? 0|(red+0.5):0;
	    color.green = green>0? 0|(green+0.5):0;
	    color.blue = blue>0? 0|(blue+0.5):0;
	}

}