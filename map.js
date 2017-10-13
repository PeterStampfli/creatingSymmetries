"use strict";

/*
creating the mapping data
with a transform of the coordinates
*/

function Map(fastFunction){
	this.width=0;
	this.height=0;
	this.transform=new Transform(fastFunction);
	this.inputImagePositions=[];              // for each pixel a pixel position on the input image
	this.colorPositions=[];
	this.isValid=false;                   // flag, to request remapping
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
	this.isValid=false;                            // presumable size changes and map has to be redone
	// update scale and offset
	if (this.inputImagePositions.length!=0){   // update to new dimensions
		this.transform.shiftX*=width/oldWidth;
		this.transform.shiftY*=height/oldHeight;
		this.transform.scale*=Math.sqrt((oldWidth*oldWidth+oldHeight*oldHeight)/
			                  (width*width+height*height));
	}
	// increase data size if needed, do not shrink
	oldLength=this.inputImagePositions.length;
	newLength=width*height;
	if (oldLength<newLength){
	this.inputImagePositions.length=newLength;
	this.colorPositions.length=newLength;
		for (var i=oldLength;i<newLength;i++){
			this.inputImagePositions[i]=new Vector2();
			this.colorPositions[i]=new Vector2();
		}
	}
}

/*
initialization: set the range for coordinates assuming a square canvas/map
going from -range ... +range
*/
Map.prototype.setRange=function(range){
	this.transform.setScale(2*range/this.width);
}
/*
make the mapp based on supplied map method(inputImagePosition,colorPosition,spacePosition,canvasPosition)
includes efficient offset and scaling
*/
Map.prototype.make=function(mapMethod){
	if (this.isValid){
		return;                                      // do not recaculate the map if it has been done ...
	}
	console.log("remap");
	var i,j;
	var index=0;
	var transform=this.transform;
	var height=this.height;
	var width=this.width;
	var iWidth=1.0/width;
	var iHeight=1.0/height;
	var iLimit=0.5*(width-1);
	var jLimit=0.5*(height-1);
	var spacePosition=new Vector2(); // pixel position in virtual space
	var canvasPosition=new Vector2(); //relative pixel position on canvas (0,0)....(1,1)
	var inputImagePositions=this.inputImagePositions;
	var colorPositions=this.colorPositions;
	this.isValid=true;
	canvasPosition.y=-0.5*iHeight;
	j=-jLimit;
	while (j<=jLimit){
		canvasPosition.y+=iHeight;
		canvasPosition.x=-0.5*iWidth;
		i=-iLimit
		while (i<=iLimit){
			canvasPosition.x+=iWidth;
			spacePosition.x=i;
			spacePosition.y=j;
			transform.shiftScale(spacePosition);

			mapMethod(inputImagePositions[index],colorPositions[index],spacePosition,canvasPosition);
			index++;
			i+=1;
		}
		j+=1;
	}
}

/*
trivial test method: identity
*/
Map.prototype.identity=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	inputImagePosition.x=spacePosition.x;
	inputImagePosition.y=spacePosition.y;
}