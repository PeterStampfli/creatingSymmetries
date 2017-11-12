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
	oldWidth=this.width;
	oldHeight=this.height;
	width=Math.round(width);
	height=Math.round(height);
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
for limited range given by corner components in map pixel space
*/
Map.prototype.makeMapRegion=function(mapMethod,xMin,yMin,xMax,yMax){
	console.log("remap");
		console.log("set map size - scale is "+this.transform.scale);

	this.isValid=true;
	var h;
	xMin=Math.min(Math.max(0,xMin),this.width-1);
	xMax=Math.min(Math.max(0,xMax),this.width-1);
	if (xMax<xMin){
		h=xMax;
		xMax=xMin;
		xMin=h;
	}
	yMin=Math.min(Math.max(0,yMin),this.height-1);
	yMax=Math.min(Math.max(0,yMax),this.height-1);
	if (yMax<yMin){
		h=yMax;
		yMax=yMin;
		yMin=h;
	}
	var transform=this.transform;
	var height=this.height;
	var width=this.width;
	var iWidth=1.0/(width-1);
	var iHeight=1.0/(height-1);
	var spacePositionX,spacePositionY;
	var canvasPositionX,canvasPositionY;
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
	canvasPositionY=(yMin+0.5)*iHeight;
	spacePositionY=scaleShiftY+yMin*scale;
	var i,j;
	var index=0;
	for (j=yMin;j<=yMax;j++){
		canvasPositionX=(xMin+0.5)*iWidth;
		spacePositionX=scaleShiftX+xMin*scale;
		index=j*width+xMin;
		for (i=xMin;i<=xMax;i++){
			spacePosition.x=spacePositionX;
			spacePosition.y=spacePositionY;
			canvasPosition.x=canvasPositionX;
			canvasPosition.y=canvasPositionY;
			mapMethod(imagePosition,colorPosition,spacePosition,canvasPosition);
			imagePositionX[index]=imagePosition.x;
			imagePositionY[index]=imagePosition.y;
			colorPositionX[index]=colorPosition.x;
			colorPositionY[index]=colorPosition.y;
			index++;
			canvasPositionX+=iWidth;
			spacePositionX+=scale;
		}
		canvasPositionY+=iHeight;
		spacePositionY+=scale;
	}
}

/*
make the entire map
*/
Map.prototype.make=function(mapMethod){
	this.makeMapRegion(mapMethod,0,0,this.width-1,this.height-1);
}

/*
trivial test method: identity
*/
Map.prototype.identity=function(inputImagePosition,colorPosition,spacePosition,canvasPosition){
	inputImagePosition.x=spacePosition.x+10;
	inputImagePosition.y=spacePosition.y+100;
}

/*
look up map at position 
using linear interpolation/extrapolation to get intervall [0,range) with some safety margin upwards

taking care that indices i=0...width-1, j=0...height-1

return true if position is inside, false if outside
*/
Map.prototype.imagePosition=function(position){
	var transform=this.transform;
	var x,y;
	var epsilon=0.01;
	var h,k;
	var dx,dy;
    var i00, i01, i10, i11;
    var f00, f01, f10, f11;
	var imagePositionX=this.imagePositionX;
	var imagePositionY=this.imagePositionY;
	// untransform to pixel coordinates and get base index, check if is inside
	x=position.x/transform.scale-transform.shiftX;
	if ((x > this.width+epsilon)||(x<-epsilon)){
		return false;
	}
	y=position.y/transform.scale-transform.shiftY;
	if ((y>this.height+epsilon)||(y<-epsilon)){
		return false;
	}
	h=Math.floor(x);
	console.log(h);
	if (h<0){
		h=0;
	}
	else if (h>=this.width-1){
		h=this.width-2;
	}
	dx=x-h;	
	k=Math.floor(y);
	if (k<0){
		k=0;
	}
	else if (k>=this.height-1){
		k=height-2;
	}
	dy=y-k;
    // the indices to pixel data
    i00 = h+this.width*k;
    i01 = i00+this.width;
    i10 = i00+1;
    i11 = i01+1;
    //  the weights
    f00 = (1 - dx) * (1 - dy);
    f01 = (1 - dx) * dy;
    f10 = dx * (1 - dy);
    f11 = dy * dx;
    position.x=f00*imagePositionX[i00]+f01*imagePositionX[i01]+f10*imagePositionX[i10]+f11*imagePositionX[i11];
    position.y=f00*imagePositionY[i00]+f01*imagePositionY[i01]+f10*imagePositionY[i10]+f11*imagePositionY[i11];
	return true;
}