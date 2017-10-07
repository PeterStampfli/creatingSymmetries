"use strict";

/*
the mapping data
width and height, data, input

*/

function Map(){
	this.width=0;
	this.height=0;
	this.scale=1;       // scaling from pixel to coordinates
	this.offsetI=0;     // pixel offsets
	this.offsetJ=0;
	this.input=new MapInput(); // input for map method
	this.data=[];              // for each pixel a MapOutput object
}

/*
set the size, update the data array, fill with new MapOutput objects
increases only the data array
*/
Map.prototype.setSize=function(width,height){
	var oldLength,newLength;
	var oldWidth,oldHeight;
	width=Math.round(width);
	height=Math.round(height);
	oldWidth=width;
	oldHeight=height;
	this.width=width;
	this.height=height;
	// update scale and offset
	if (this.data.length==0){                     // initialization, set scale separately
		this.offsetI=width/2;
		this.offsetJ=height/2;
	}
	else {                                   // update to new dimensions
		this.offsetI*=width/oldWidth;
		this.offsetJ*=height/oldHeight;
		this.scale*=Math.sqrt((oldWidth*oldWidth+oldHeight*oldHeight)/
			                  (width*width+height*height));
	}
	// increase data size if needed, do not shrink
	oldLength=this.data.length;
	newLength=width*height;
	if (oldLength<newLength){
	this.data.length=newLength;
		for (var i=oldLength;i<newLength;i++){
			this.data[i]=new MapOutput();
		}
	}
}

/*
make the mapp based on supplied map method(mapOutput,mapInput)
includes efficient offset and scaling
*/
Map.prototype.make=function(mapMethod){
	var i,j;
	var index=0;
	var scale=this.scale;
	var width=this.width;
	var height=this.height;
	var iWidth=1.0/width;
	var iHeight=1.0/height;
	var input=this.input;    // shortcut to the input object
	var data=this.data;
	input.canvasY=-0.5*iHeight;
	input.y=(-0.5-this.offsetJ)*scale;
	for (j=0;j<height;j++){
		input.canvasY+=iHeight;
		input.canvasX=-0.5*iWidth;
		input.y+=scale;
		input.x=(-0.5-this.offsetI)*scale;
		for (i=0;i<width;i++){
			input.canvasX+=iWidth;
			input.x+=scale;
			mapMethod(data[index++],input);
		}
	}
}

/*
trivial test methos: identity
*/
Map.prototype.identity=function(output,input){
	output.x=input.x;
	output.y=input.y;
}