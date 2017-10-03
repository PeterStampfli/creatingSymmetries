"use strict";

/*
the mapping data
width and height, data, input

*/

function Map(){
	this.width=0;
	this.height=0;
	this.data=[];
	this.input=new MapInput();
}

/*
set the size, update the data array, fill with new MapOutput objects
increases only the data array
*/
Map.prototype.setSize=function(width,height){
	var oldLength,newLength;
	this.width=width;
	this.height=height;
	this.scale=1;       // scaling from pixel to coordinates
	this.offsetI=0;     // pixel offsets
	this.offsetJ=0;
	oldLength=this.data.length;
	newLength=width*height;
	// increase data size if needed, do not shrink
	if (oldLength<newLength){
	this.data.length=newLength;
		for (var i=oldLength;i<newLength;i++){
			this.data[i]=new MapOutput();
		}
	}
}

/*
make the mapp based on supplied map method(mapOutput,mapInput)
*/
Map.prototype.make=function(mapMethod){
	var i,j;
	var index=0;
	var width=this.width;
	var height=this.height;
	var iWidth=1.0/width;
	var iHeight=1.0/height;
	var input=this.input;    // shortcut to the input object
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



		}



	}


}