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
		this.isValid=true;
		canvasPosition.y=0;
		for (j=0;j<height;j++){
			canvasPosition.y+=iHeight;
			canvasPosition.x=0;
			for (i=0;i<width;i++){
				canvasPosition.x+=iWidth;
				spacePosition.x=i;
				spacePosition.y=j;
				transform.shiftScale(spacePosition);
				mapMethod(imagePosition,colorPosition,spacePosition,canvasPosition);
				imagePositionX[index]=imagePosition.x;
				imagePositionY[index]=imagePosition.y;
				colorPositionX[index]=colorPosition.x;
				colorPositionY[index]=colorPosition.y;
				index++;
			}
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