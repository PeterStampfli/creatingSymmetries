"use strict";

/*
creating the mapping data
with a transform of the coordinates
that is: (i,j) are translated and scaled to give (x,y)
*/

function Map(fastFunction){
	this.width=0;
	this.height=0;
	this.transform=new Transform(fastFunction);
	this.imagePositionX=[];              // for each pixel a pixel position on the input image
	this.imagePositionY=[];              // for each pixel a pixel position on the input image
	this.colorPositionX=[];
	this.colorPositionY=[];
	this.isValid=false;                   // flag, to request remapping
}

/*
set the size, update the data array, fill with new MapOutput objects
increases only the data array
only called if size changes
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
	this.isValid=false;                            // presumable size changes and map has to be redone
	// update scale and offset
	if (this.imagePositionX.length!=0){   // update to new dimensions
		this.transform.shiftX*=width/oldWidth;
		this.transform.shiftY*=height/oldHeight;
		this.transform.scale*=Math.sqrt((oldWidth*oldWidth+oldHeight*oldHeight)/
			                  (width*width+height*height));
	}
	// increase data size if needed, do not shrink
	oldLength=this.imagePositionX.length;
	newLength=width*height;
	if (oldLength<newLength){
	this.imagePositionX.length=newLength;
	this.imagePositionY.length=newLength;
	this.colorPositionX.length=newLength;
	this.colorPositionY.length=newLength;
	}
}

/*
set the initial relative origin - that is the shift of the transform
the size of the map has to be initialized
*/
Map.prototype.setRelativeOrigin=function(x,y){
	this.transform.setShift(-x*this.width,-y*this.height);
}

/*
initialization: set the intervall length (range) for coordinates assuming a square canvas/map

if relative origin =(0,0) then pixel (i,j)=(0,0) lies at (0,0) and inexistant pixel (width,width) would lie at (range,range)
*/
Map.prototype.setRange=function(range){
	this.transform.setScale(range/this.width);
}
/*
make the mapp based on supplied map method(inputImagePosition,colorPosition,spacePosition,canvasPosition)
includes efficient offset and scaling
*/
Map.prototype.make=function(mapMethod){
	if (!this.isValid){ // do not recalculate the map if it has been done ...
		console.log("remap");
		var i,j;
		var index=0;
		var transform=this.transform;
		var height=this.height;
		var width=this.width;
		var iWidth=1.0/(width-1);
		var iHeight=1.0/(height-1);
		var spacePosition=new Vector2(); // pixel position in virtual space
		var canvasPosition=new Vector2(); //relative pixel position on canvas (0,0)....(1,1), independent of offset
		var imagePositionX=this.imagePositionX;
		var imagePositionY=this.imagePositionY;
		var imagePosition=new Vector2();
		var colorPositionX=this.colorPositionX;
		var colorPositionY=this.colorPositionY;
		var colorPosition=new Vector2();
		var scale=this.transform.scale;
		var scaleShiftX=scale*this.transform.shiftX;
		var scaleShiftY=scale*this.transform.shiftY;
		this.isValid=true;
		canvasPosition.y=0.5*iHeight;
		spacePosition.y=scaleShiftY;
		for (j=0;j<height;j++){
			canvasPosition.x=0.5*iWidth;
			spacePosition.x=scaleShiftX;
			for (i=0;i<width;i++){
				mapMethod(imagePosition,colorPosition,spacePosition,canvasPosition);
				imagePositionX[index]=imagePosition.x;
				imagePositionY[index]=imagePosition.y;
				colorPositionX[index]=colorPosition.x;
				colorPositionY[index]=colorPosition.y;
				index++;
				canvasPosition.x+=iWidth;
				spacePosition.x+=scale;
			}
			canvasPosition.y+=iHeight;
			spacePosition.y+=scale;
		}
	}
}

/*
trivial test method: identity
*/
Map.prototype.identity=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	inputImagePosition.x=spacePosition.x;
	inputImagePosition.y=spacePosition.y;
}

/*
look up map at position 
using linear interpolation/extrapolation to get intervall [0,range) with some safety margin upwards

taking care that indices i=0...width-1, j=0...height-1

return true if position is inside, false if outside
*/

Map.prototype.position=function(position){
	var x,y;
	var i,j;
	console.log("*"+position.x);
	// untransform to pixel coordinates and get base index, check if is inside
	var transform=this.transform;
	x=position.x/transform.scale-transform.shiftX;
	i=Math.floor(x);
	console.log(i);
	if ((i > this.width)||(i<-1)){
		return false;
	}
	if (i<0){
		i=0;
	}
	else if (i>=width-1){
		i=width-2;
	}


	y=position.y/transform.scale-transform.shiftY;
	j=Math.floor(y);
	if ((j>this.height)||(j<-1)){
		return false;
	}
	




	return true;
}